import React, { Suspense, useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import {
    OrbitControls,
    PointerLockControls,
    Sky,
    Environment,
    ContactShadows,
    PerspectiveCamera,
    Stars,
    Text,
    Float,
    Box,
    Plane,
    Sparkles,
    BakeShadows,
    KeyboardControls,
    useKeyboardControls
} from '@react-three/drei';
import * as THREE from 'three';
import { EffectComposer, Bloom, Vignette, ChromaticAberration, Noise } from '@react-three/postprocessing';
import { motion, AnimatePresence } from 'framer-motion';
import { Crosshair, Map as MapIcon, Shield, Radio, Activity, Target, Zap, Settings, ArrowLeft } from 'lucide-react';

// ─── SHADERS ─────────────────────────────────────────────────────────

const asphaltVertex = `
  varying vec2 vUv;
  varying vec3 vWorldPosition;
  void main() {
    vUv = uv;
    vWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const asphaltFragment = `
  uniform float time;
  uniform float wetness;
  varying vec2 vUv;
  varying vec3 vWorldPosition;

  float noise(vec2 p) {
    return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
  }

  void main() {
    vec2 p = vUv * 100.0;
    float n = noise(floor(p));
    
    // Dark asphalt base
    vec3 baseColor = vec3(0.04, 0.04, 0.06);
    
    // Road markings
    float stripeX = step(0.98, fract(vUv.x * 20.0)) * step(0.48, fract(vUv.y * 2.0)) * step(fract(vUv.y * 2.0), 0.52);
    float stripeY = step(0.99, fract(vUv.y * 10.0)) * step(0.49, fract(vUv.x * 2.0)) * step(fract(vUv.x * 2.0), 0.51);
    vec3 roadColor = mix(baseColor, vec3(0.6, 0.6, 0.4), max(stripeX, stripeY) * 0.5);

    // Wetness and Puddles
    float puddleMask = noise(vUv * 5.0 + vec2(time * 0.1));
    float isPuddle = step(0.7, puddleMask) * wetness;
    
    vec3 finalColor = mix(roadColor, roadColor * 0.2, wetness * 0.5);
    finalColor = mix(finalColor, vec3(0.02, 0.02, 0.03), isPuddle);

    gl_FragColor = vec4(finalColor, 1.0);
  }
`;

// ─── IMPACT VFX ──────────────────────────────────────────────────────

const ImpactFlash = ({ position }) => {
    return (
        <group position={position}>
            <pointLight intensity={10} distance={5} color="#ef4444" />
            <Sparkles count={20} scale={1} size={3} speed={2} color="#f87171" />
        </group>
    );
};

// ─── BUILDING COMPONENT ──────────────────────────────────────────────

const CityBuilding = ({ position, width, height, depth, color, onHit }) => {
    const [hovered, setHovered] = useState(false);

    return (
        <group
            position={position}
            onPointerOver={() => setHovered(true)}
            onPointerOut={() => setHovered(false)}
            onClick={(e) => {
                e.stopPropagation();
                onHit(e.point);
            }}
        >
            {/* Main Structure */}
            <Box args={[width, height, depth]} castShadow receiveShadow>
                <meshStandardMaterial
                    color={hovered ? '#4f46e5' : color}
                    roughness={0.1}
                    metalness={0.9}
                    emissive={color}
                    emissiveIntensity={hovered ? 0.3 : 0.05}
                />
            </Box>

            {/* Windows System */}
            <mesh position={[0, 0, depth / 2 + 0.01]}>
                <planeGeometry args={[width * 0.8, height * 0.8]} />
                <meshStandardMaterial
                    color="#1e1b4b"
                    emissive="#60a5fa"
                    emissiveIntensity={Math.random() > 0.5 ? 2 : 0.1}
                    transparent
                    opacity={0.8}
                />
            </mesh>

            {/* Top Antenna */}
            {height > 20 && (
                <mesh position={[0, height / 2 + 2, 0]}>
                    <cylinderGeometry args={[0.05, 0.05, 4]} />
                    <meshStandardMaterial color="white" />
                    <pointLight position={[0, 2, 0]} intensity={20} color="red" distance={5} />
                </mesh>
            )}
        </group>
    );
};

// ─── PLAYER / CAMERA SYSTEM ──────────────────────────────────────────

const Player = ({ onShoot }) => {
    const { camera, raycaster, scene } = useThree();
    const [, getKeys] = useKeyboardControls();
    const [isFiring, setIsFiring] = useState(false);

    useEffect(() => {
        const handleDown = () => {
            setIsFiring(true);

            // Raycast for shooting
            raycaster.setFromCamera(new THREE.Vector2(0, 0), camera);
            const intersects = raycaster.intersectObjects(scene.children, true);
            if (intersects.length > 0) {
                onShoot(intersects[0].point);
            }
        };
        const handleUp = () => setIsFiring(false);

        window.addEventListener('mousedown', handleDown);
        window.addEventListener('mouseup', handleUp);
        return () => {
            window.removeEventListener('mousedown', handleDown);
            window.removeEventListener('mouseup', handleUp);
        };
    }, [camera, raycaster, scene, onShoot]);

    useFrame((state, delta) => {
        const { forward, backward, left, right } = getKeys();

        const moveVector = new THREE.Vector3(0, 0, 0);
        if (forward) moveVector.z -= 1;
        if (backward) moveVector.z += 1;
        if (left) moveVector.x -= 1;
        if (right) moveVector.x += 1;

        moveVector.normalize().multiplyScalar(15 * delta);

        const direction = new THREE.Vector3();
        camera.getWorldDirection(direction);
        direction.y = 0;
        direction.normalize();

        const side = new THREE.Vector3();
        side.crossVectors(camera.up, direction).normalize();

        const finalMove = new THREE.Vector3();
        finalMove.add(direction.clone().multiplyScalar(-moveVector.z));
        finalMove.add(side.clone().multiplyScalar(moveVector.x));

        camera.position.add(finalMove);

        // Head bobbing
        if (forward || backward || left || right) {
            camera.position.y = 1.7 + Math.sin(state.clock.elapsedTime * 10) * 0.05;
        } else {
            camera.position.y = THREE.MathUtils.lerp(camera.position.y, 1.7, 0.1);
        }
    });

    return null;
};

// ─── THE WORLD ───────────────────────────────────────────────────────

const CityEnvironment = ({ wetness, onHit }) => {
    const buildings = useMemo(() => {
        const arr = [];
        const gridSize = 300;
        const spacing = 25;

        for (let x = -gridSize; x < gridSize; x += spacing) {
            for (let z = -gridSize; z < gridSize; z += spacing) {
                if (Math.abs(x) < 10 || Math.abs(z) < 10) continue;

                if (Math.random() > 0.3) {
                    const h = 10 + Math.random() * 80;
                    const w = 8 + Math.random() * 12;
                    const d = 8 + Math.random() * 12;
                    const colors = ['#0f172a', '#1e293b', '#334155', '#1e1b4b', '#020617'];
                    arr.push({
                        pos: [x + (Math.random() - 0.5) * 10, h / 2, z + (Math.random() - 0.5) * 10],
                        w, h, d,
                        color: colors[Math.floor(Math.random() * colors.length)]
                    });
                }
            }
        }
        return arr;
    }, []);

    const uniforms = useMemo(() => ({
        time: { value: 0 },
        wetness: { value: wetness }
    }), [wetness]);

    useFrame((state) => {
        uniforms.time.value = state.clock.elapsedTime;
    });

    return (
        <>
            {/* Ground / Road System */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
                <planeGeometry args={[2000, 2000]} />
                <shaderMaterial
                    vertexShader={asphaltVertex}
                    fragmentShader={asphaltFragment}
                    uniforms={uniforms}
                    transparent
                />
            </mesh>

            {/* City Grid */}
            {buildings.map((b, i) => (
                <CityBuilding key={i} position={b.pos} width={b.w} height={b.h} depth={b.d} color={b.color} onHit={onHit} />
            ))}

            {/* Street Lights VFX */}
            {[...Array(80)].map((_, i) => (
                <pointLight
                    key={i}
                    position={[(Math.random() - 0.5) * 600, 4, (Math.random() - 0.5) * 600]}
                    intensity={150}
                    distance={30}
                    color={i % 2 === 0 ? "#fcd34d" : "#6366f1"}
                />
            ))}

            {/* Atmosphere */}
            <Sparkles count={2000} scale={400} size={2} speed={0.5} opacity={wetness > 0.5 ? 0.8 : 0.1} color={wetness > 0.5 ? "#94a3b8" : "#60a5fa"} />

            <Environment preset="city" />
            <Sky sunPosition={[100, 10, 100]} turbidity={wetness > 0.5 ? 10 : 0.1} rayleigh={wetness > 0.5 ? 5 : 0.5} />
            <Stars radius={300} depth={50} count={10000} factor={4} saturation={0} fade speed={1} />

            {wetness > 0.5 && (
                <fog attach="fog" args={['#1e293b', 10, 150]} />
            )}
        </>
    );
};

// ─── MAIN GAME PAGE ──────────────────────────────────────────────────

const UrbanWarzone = ({ setActiveTab }) => {
    const [gameState, setGameState] = useState('lobby');
    const [wetness, setWetness] = useState(0);
    const [impacts, setImpacts] = useState([]);
    const [score, setScore] = useState(0);
    const [ammo, setAmmo] = useState(30);

    const handleShoot = (point) => {
        if (ammo <= 0) return;
        setAmmo(prev => prev - 1);
        setImpacts(prev => [...prev, { id: Date.now(), pos: point }]);
        setScore(prev => prev + 100);

        // Remove impact after 1s
        setTimeout(() => {
            setImpacts(prev => prev.filter(i => i.id !== Date.now()));
        }, 1000);
    };

    return (
        <KeyboardControls
            map={[
                { name: 'forward', keys: ['ArrowUp', 'KeyW'] },
                { name: 'backward', keys: ['ArrowDown', 'KeyS'] },
                { name: 'left', keys: ['ArrowLeft', 'KeyA'] },
                { name: 'right', keys: ['ArrowRight', 'KeyD'] },
                { name: 'jump', keys: ['Space'] },
            ]}
        >
            <div style={{ position: 'fixed', inset: 0, background: '#000', color: '#fff', fontFamily: "'Outfit', sans-serif" }}>

                {/* 3D Scene */}
                <Canvas shadows camera={{ position: [0, 1.7, 10], fov: 75 }}>
                    <Suspense fallback={null}>
                        <CityEnvironment wetness={wetness} onHit={handleShoot} />
                        {gameState === 'playing' && (
                            <>
                                <Player onShoot={handleShoot} />
                                <PointerLockControls />
                                {impacts.map(i => <ImpactFlash key={i.id} position={i.pos} />)}
                            </>
                        )}

                        <EffectComposer disableNormalPass>
                            <Bloom luminanceThreshold={1} mipmapBlur intensity={0.8} />
                            <Vignette darkness={0.7} />
                            <Noise opacity={wetness > 0.5 ? 0.15 : 0.05} />
                            <ChromaticAberration offset={[0.0015, 0.0015]} />
                        </EffectComposer>
                        <BakeShadows />
                    </Suspense>
                </Canvas>

                {/* HUD OVERLAY */}
                <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 10 }}>

                    {/* Header Info */}
                    <div style={{ padding: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', pointerEvents: 'auto' }}>
                            <button
                                onClick={() => setActiveTab('games')}
                                style={{ background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', padding: '10px 20px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '10px', backdropFilter: 'blur(10px)', cursor: 'pointer', fontWeight: 900 }}
                            >
                                <ArrowLeft size={18} /> EXIT ENGINE
                            </button>

                            <button
                                onClick={() => setWetness(prev => prev > 0 ? 0 : 1)}
                                style={{ background: wetness > 0 ? '#3b82f6' : 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', padding: '10px 20px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '10px', backdropFilter: 'blur(10px)', cursor: 'pointer', fontWeight: 900 }}
                            >
                                <Radio size={18} /> {wetness > 0 ? 'RAIN MODE: ON' : 'STORM MODE'}
                            </button>
                        </div>

                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '0.7rem', color: '#6366f1', fontWeight: 900, letterSpacing: '4px', marginBottom: '4px' }}>PHASE 1: AAA GROUND SYSTEM</div>
                            <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '4px' }}>URBAN <span style={{ color: '#6366f1' }}>WARZONE</span></h1>
                        </div>

                        <div style={{ background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)', padding: '15px 25px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '20px' }}>
                            <div style={{ textAlign: 'right' }}>
                                <div style={{ fontSize: '0.6rem', color: '#94a3b8', fontWeight: 800 }}>COMBAT SCORE</div>
                                <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#6366f1' }}>{score.toLocaleString()}</div>
                            </div>
                            <Target size={24} color="#6366f1" />
                        </div>
                    </div>

                    {/* TOP HUD GAUGES */}
                    <div style={{ position: 'absolute', top: '100px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '2rem' }}>
                        <div style={{ width: '150px', height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', position: 'relative' }}>
                            <div style={{ width: '80%', height: '100%', background: '#6366f1', borderRadius: '2px', boxShadow: '0 0 10px #6366f1' }} />
                            <div style={{ fontSize: '0.6rem', fontWeight: 900, marginTop: '8px', textAlign: 'center' }}>LUMEN STABILITY</div>
                        </div>
                        <div style={{ width: '150px', height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', position: 'relative' }}>
                            <div style={{ width: '95%', height: '100%', background: '#10b981', borderRadius: '2px', boxShadow: '0 0 10px #10b981' }} />
                            <div style={{ fontSize: '0.6rem', fontWeight: 900, marginTop: '8px', textAlign: 'center' }}>NANite STREAMING</div>
                        </div>
                    </div>

                    {/* CROSSHAIR */}
                    {gameState === 'playing' && (
                        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', opacity: 0.7 }}>
                            <div style={{ width: '30px', height: '30px', border: '1px solid rgba(255,255,255,0.3)', borderRadius: '50%' }} />
                            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '4px', height: '4px', background: '#6366f1', borderRadius: '50%' }} />
                            {/* Animated Crosshair Brackets */}
                            <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 2 }} style={{ position: 'absolute', top: '-10px', left: '-10px', width: '10px', height: '10px', borderTop: '2px solid #6366f1', borderLeft: '2px solid #6366f1' }} />
                            <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 2 }} style={{ position: 'absolute', bottom: '-10px', right: '-10px', width: '10px', height: '10px', borderBottom: '2px solid #6366f1', borderRight: '2px solid #6366f1' }} />
                        </div>
                    )}

                    {/* FOOTER STATS */}
                    <div style={{ position: 'absolute', bottom: '2rem', left: '2rem', display: 'flex', gap: '2rem' }}>
                        <div style={{ background: 'rgba(0,0,0,0.8)', borderLeft: '4px solid #ef4444', padding: '15px 30px', borderRadius: '4px 16px 16px 4px', backdropFilter: 'blur(10px)' }}>
                            <div style={{ fontSize: '0.65rem', fontWeight: 900, color: '#ef4444', marginBottom: '4px', textTransform: 'uppercase' }}>Tactical HP</div>
                            <div style={{ fontSize: '1.5rem', fontWeight: 900 }}>100 <span style={{ fontSize: '0.8rem', color: '#64748b' }}>/ 100</span></div>
                        </div>
                        <div style={{ background: 'rgba(0,0,0,0.8)', borderLeft: '4px solid #6366f1', padding: '15px 30px', borderRadius: '4px 16px 16px 4px', backdropFilter: 'blur(10px)' }}>
                            <div style={{ fontSize: '0.65rem', fontWeight: 900, color: '#6366f1', marginBottom: '4px', textTransform: 'uppercase' }}>Ammo Count</div>
                            <div style={{ fontSize: '1.5rem', fontWeight: 900 }}>{ammo} <span style={{ fontSize: '0.8rem', color: '#64748b' }}>/ 30</span></div>
                            <div style={{ width: '100%', height: '2px', background: 'rgba(255,255,255,0.1)', marginTop: '5px' }}>
                                <motion.div animate={{ width: `${(ammo / 30) * 100}%` }} style={{ height: '100%', background: '#6366f1' }} />
                            </div>
                        </div>
                    </div>

                    {/* MINI MAP */}
                    <div style={{ position: 'absolute', bottom: '2rem', right: '2rem', width: '220px', height: '220px', background: 'rgba(15,23,42,0.8)', borderRadius: '24px', border: '2px solid rgba(255,255,255,0.1)', padding: '10px', backdropFilter: 'blur(10px)' }}>
                        <div style={{ width: '100%', height: '100%', background: 'rgba(99,102,241,0.05)', borderRadius: '16px', position: 'relative', overflow: 'hidden' }}>
                            <div style={{ position: 'absolute', width: '200%', height: '200%', background: 'repeating-linear-gradient(0deg, rgba(255,255,255,0.02) 0px, rgba(255,255,255,0.02) 1px, transparent 1px, transparent 20px)', zIndex: 0 }} />
                            <MapIcon style={{ position: 'absolute', top: '10px', right: '10px', opacity: 0.3 }} size={16} />
                            <div style={{ position: 'absolute', top: '50%', left: '50%', width: '12px', height: '12px', background: '#6366f1', borderRadius: '50%', transform: 'translate(-50%, -50%)', boxShadow: '0 0 15px #6366f1' }} />
                            <motion.div animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0.2, 0.5] }} transition={{ repeat: Infinity, duration: 2 }} style={{ position: 'absolute', top: '50%', left: '50%', width: '60px', height: '60px', border: '1px solid #6366f1', borderRadius: '50%', transform: 'translate(-50%, -50%)' }} />
                        </div>
                    </div>

                    {/* LOBBY INTERFACE */}
                    <AnimatePresence>
                        {gameState === 'lobby' && (
                            <motion.div
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(20px)', display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'auto' }}
                            >
                                <div style={{ maxWidth: '600px', textAlign: 'center', padding: '4rem' }}>
                                    <div style={{ display: 'inline-block', padding: '5px 15px', background: 'rgba(99,102,241,0.2)', borderRadius: '20px', color: '#6366f1', fontSize: '0.7rem', fontWeight: 900, letterSpacing: '2px', marginBottom: '1rem' }}>PREMIUM ENGINE v2.0</div>
                                    <h2 style={{ fontSize: '4rem', fontWeight: 900, marginBottom: '1rem', letterSpacing: '10px' }}>URBAN<br /><span style={{ color: '#6366f1' }}>WARZONE</span></h2>
                                    <p style={{ color: '#94a3b8', fontSize: '1.1rem', marginBottom: '3rem', lineHeight: 1.6 }}>
                                        Deploying Phase 1 AAA Ground System. <br />
                                        Open world procedural city environment.
                                    </p>

                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '3rem' }}>
                                        <div style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.05)', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.1)' }}>
                                            <div style={{ color: '#6366f1', fontSize: '1.5rem', fontWeight: 900 }}>400+</div>
                                            <div style={{ fontSize: '0.6rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', marginTop: '5px' }}>Buildings</div>
                                        </div>
                                        <div style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.05)', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.1)' }}>
                                            <div style={{ color: '#10b981', fontSize: '1.5rem', fontWeight: 900 }}>144</div>
                                            <div style={{ fontSize: '0.6rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', marginTop: '5px' }}>Max FPS</div>
                                        </div>
                                        <div style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.05)', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.1)' }}>
                                            <div style={{ color: '#f59e0b', fontSize: '1.5rem', fontWeight: 900 }}>PBR</div>
                                            <div style={{ fontSize: '0.6rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', marginTop: '5px' }}>Materials</div>
                                        </div>
                                    </div>

                                    <motion.button
                                        whileHover={{ scale: 1.05, boxShadow: '0 0 50px rgba(99,102,241,0.8)' }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => setGameState('playing')}
                                        style={{ width: '100%', padding: '1.5rem', background: '#6366f1', color: 'white', border: 'none', borderRadius: '16px', fontWeight: 900, fontSize: '1.2rem', cursor: 'pointer', letterSpacing: '4px', boxShadow: '0 0 30px rgba(99,102,241,0.4)' }}
                                    >
                                        DEPLOY TO CITY
                                    </motion.button>

                                    <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'center', gap: '2rem', color: '#475569', fontSize: '0.8rem', fontWeight: 700 }}>
                                        <span>[WASD] MOVE</span>
                                        <span>[CLICK] SHOOT</span>
                                        <span>[ESC] MENU</span>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                </div>
            </div>
        </KeyboardControls>
    );
};


export default UrbanWarzone;
