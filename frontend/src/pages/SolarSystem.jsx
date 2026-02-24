import React, { useRef, useMemo, useState, Suspense, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Stars, PerspectiveCamera, Html, useHelper, Float, Sparkles, Ring } from '@react-three/drei';
import * as THREE from 'three';
import { EffectComposer, Bloom, Noise, Vignette, GodRays, DepthOfField } from '@react-three/postprocessing';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Play, Pause, ChevronRight, X, Info, Camera, Compass, Map, Layers, FastForward, Rewind, Maximize2 } from 'lucide-react';
import gsap from 'gsap';

// ─── NASA-LEVEL PLANETARY DATA ─────────────────────────────────────────

const PLANETS_DATA = [
    {
        name: "Mercury",
        size: 0.38, // Relative to Earth
        color: "#9ca3af",
        distance: 12,
        speed: 4.7, // Radial velocity
        rotationSpeed: 0.004,
        tilt: 0.03,
        eccentricity: 0.2056,
        data: {
            diameter: "4,879 km",
            mass: "3.285 × 10^23 kg",
            gravity: "3.7 m/s²",
            distanceFromSun: "57.9M km",
            moons: "0",
            atmosphere: "Oxygen, Sodium, Hydrogen",
            orbitalPeriod: "88 days"
        },
        satellites: []
    },
    {
        name: "Venus",
        size: 0.95,
        color: "#fbbf24",
        distance: 18,
        speed: 3.5,
        rotationSpeed: -0.002, // Retrograde
        tilt: 177.3,
        eccentricity: 0.0067,
        data: {
            diameter: "12,104 km",
            mass: "4.867 × 10^24 kg",
            gravity: "8.87 m/s²",
            distanceFromSun: "108.2M km",
            moons: "0",
            atmosphere: "Carbon Dioxide, Nitrogen",
            orbitalPeriod: "225 days"
        },
        satellites: []
    },
    {
        name: "Earth",
        size: 1.0,
        color: "#3b82f6",
        distance: 26,
        speed: 2.9,
        rotationSpeed: 0.015,
        tilt: 23.4,
        eccentricity: 0.0167,
        data: {
            diameter: "12,742 km",
            mass: "5.972 × 10^24 kg",
            gravity: "9.81 m/s²",
            distanceFromSun: "149.6M km",
            moons: "1 (Luna)",
            atmosphere: "Nitrogen, Oxygen",
            orbitalPeriod: "365.25 days"
        },
        satellites: [
            { name: "Moon", distance: 1.5, size: 0.27, color: "#cbd5e1", speed: 2.0 },
            { name: "ISS", distance: 1.2, size: 0.05, color: "#94a3b8", speed: 5.0, type: "man-made" },
            { name: "Hubble", distance: 1.35, size: 0.04, color: "#64748b", speed: 4.2, type: "man-made" }
        ]
    },
    {
        name: "Mars",
        size: 0.53,
        color: "#ef4444",
        distance: 35,
        speed: 2.4,
        rotationSpeed: 0.014,
        tilt: 25.2,
        eccentricity: 0.0934,
        data: {
            diameter: "6,779 km",
            mass: "6.39 × 10^23 kg",
            gravity: "3.72 m/s²",
            distanceFromSun: "227.9M km",
            moons: "2 (Phobos, Deimos)",
            atmosphere: "Carbon Dioxide, Nitrogen, Argon",
            orbitalPeriod: "687 days"
        },
        satellites: [
            { name: "Phobos", distance: 0.8, size: 0.1, color: "#71717a", speed: 3.5 },
            { name: "Deimos", distance: 1.1, size: 0.08, color: "#52525b", speed: 2.8 }
        ]
    },
    {
        name: "Jupiter",
        size: 3.5, // Reduced for viewport but still large
        color: "#f97316",
        distance: 55,
        speed: 1.3,
        rotationSpeed: 0.04,
        tilt: 3.1,
        eccentricity: 0.0489,
        data: {
            diameter: "139,820 km",
            mass: "1.898 × 10^27 kg",
            gravity: "24.79 m/s²",
            distanceFromSun: "778.5M km",
            moons: "79 (Major: 4)",
            atmosphere: "Hydrogen, Helium",
            orbitalPeriod: "11.86 years"
        },
        satellites: [
            { name: "Io", distance: 4.5, size: 0.3, color: "#fde047", speed: 1.8 },
            { name: "Europa", distance: 5.2, size: 0.25, color: "#fef9c3", speed: 1.5 },
            { name: "Ganymede", distance: 6.0, size: 0.4, color: "#d1d5db", speed: 1.2 },
            { name: "Callisto", distance: 7.0, size: 0.38, color: "#9ca3af", speed: 0.9 }
        ]
    },
    {
        name: "Saturn",
        size: 2.9,
        color: "#fbbf24",
        distance: 78,
        speed: 0.9,
        rotationSpeed: 0.035,
        tilt: 26.7,
        eccentricity: 0.0565,
        hasRings: true,
        data: {
            diameter: "116,460 km",
            mass: "5.683 × 10^26 kg",
            gravity: "10.44 m/s²",
            distanceFromSun: "1.4B km",
            moons: "82 (Major: Titan)",
            atmosphere: "Hydrogen, Helium",
            orbitalPeriod: "29.45 years"
        },
        satellites: [
            { name: "Titan", distance: 5.5, size: 0.45, color: "#f59e0b", speed: 1.1 }
        ]
    },
    {
        name: "Uranus",
        size: 1.8,
        color: "#22d3ee",
        distance: 98,
        speed: 0.7,
        rotationSpeed: -0.02, // Retrograde
        tilt: 97.8, // Sideways
        eccentricity: 0.0463,
        data: {
            diameter: "50,724 km",
            mass: "8.681 × 10^25 kg",
            gravity: "8.69 m/s²",
            distanceFromSun: "2.9B km",
            moons: "27",
            atmosphere: "Hydrogen, Helium, Methane",
            orbitalPeriod: "84 years"
        },
        satellites: [
            { name: "Miranda", distance: 3.0, size: 0.15, color: "#cbd5e1", speed: 1.4 }
        ]
    },
    {
        name: "Neptune",
        size: 1.7,
        color: "#6366f1",
        distance: 120,
        speed: 0.5,
        rotationSpeed: 0.02,
        tilt: 28.3,
        eccentricity: 0.0094,
        data: {
            diameter: "49,244 km",
            mass: "1.024 × 10^26 kg",
            gravity: "11.15 m/s²",
            distanceFromSun: "4.5B km",
            moons: "14 (Major: Triton)",
            atmosphere: "Hydrogen, Helium, Methane",
            orbitalPeriod: "164.8 years"
        },
        satellites: [
            { name: "Triton", distance: 3.2, size: 0.25, color: "#e2e8f0", speed: 1.2 }
        ]
    }
];

// ─── SHADERS & VFX ───────────────────────────────────────────────────

const sunVertexShader = `
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vPosition;
  void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    vPosition = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const sunFragmentShader = `
  uniform float time;
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vPosition;

  // Simple noise function
  float noise(vec3 p) {
    return sin(p.x * 10.0 + time) * sin(p.y * 10.0 + time) * sin(p.z * 10.0 + time);
  }

  void main() {
    float n = noise(vPosition * 0.5);
    vec3 baseColor = vec3(1.0, 0.4, 0.0); // Orange
    vec3 highlightColor = vec3(1.0, 0.9, 0.1); // Bright yellow
    
    vec3 color = mix(baseColor, highlightColor, n * 0.5 + 0.5);
    
    // Fresnel effect for glow
    float viewDot = dot(vNormal, vec3(0.0, 0.0, 1.0));
    float fresnel = pow(1.0 - viewDot, 3.0);
    
    vec3 glow = vec3(1.0, 0.6, 0.2) * fresnel * 2.0;
    
    gl_FragColor = vec4(color + glow, 1.0);
  }
`;

// ─── HELPER COMPONENTS ───────────────────────────────────────────────

const Satellite = ({ satellite, parentSize, timeScale }) => {
    const ref = useRef();
    const { name, distance, size, color, speed, type } = satellite;

    useFrame(({ clock }) => {
        const t = clock.getElapsedTime() * timeScale * speed * 0.5;
        if (ref.current) {
            ref.current.position.x = Math.cos(t) * (parentSize + distance);
            ref.current.position.z = Math.sin(t) * (parentSize + distance);
            ref.current.rotation.y += 0.02;
        }
    });

    return (
        <group ref={ref}>
            <mesh>
                {type === "man-made" ? <boxGeometry args={[size, size, size]} /> : <sphereGeometry args={[size, 16, 16]} />}
                <meshStandardMaterial color={color} metalness={0.8} roughness={0.2} />
            </mesh>
            {type !== "man-made" && (
                <mesh rotation={[Math.PI / 2, 0, 0]}>
                    <ringGeometry args={[parentSize + distance - 0.01, parentSize + distance + 0.01, 64]} />
                    <meshBasicMaterial color="white" transparent opacity={0.05} side={THREE.DoubleSide} />
                </mesh>
            )}
        </group>
    );
};

const Planet = ({ planet, onSelect, selected, timeScale, showOrbits }) => {
    const meshRef = useRef();
    const groupRef = useRef();
    const [hovered, setHovered] = useState(false);

    const { name, size, color, distance, speed, rotationSpeed, hasRings, tilt, eccentricity, satellites } = planet;

    useFrame(({ clock }) => {
        const t = clock.getElapsedTime() * timeScale * speed * 0.1;

        // Elliptical Orbit Logic: x = a * cos(t), z = b * sin(t)
        // b = a * sqrt(1 - e^2)
        const a = distance;
        const b = distance * Math.sqrt(1 - (eccentricity * eccentricity));

        if (groupRef.current) {
            groupRef.current.position.x = a * Math.cos(t);
            groupRef.current.position.z = b * Math.sin(t);
        }

        if (meshRef.current) {
            meshRef.current.rotation.y += rotationSpeed * timeScale;
        }
    });

    const orbitPath = useMemo(() => {
        const points = [];
        const a = distance;
        const b = distance * Math.sqrt(1 - (eccentricity * eccentricity));
        for (let i = 0; i <= 128; i++) {
            const angle = (i / 128) * Math.PI * 2;
            points.push(new THREE.Vector3(a * Math.cos(angle), 0, b * Math.sin(angle)));
        }
        return points;
    }, [distance, eccentricity]);

    return (
        <group>
            {/* Orbital Path */}
            {showOrbits && (
                <line>
                    <bufferGeometry setFromPoints={orbitPath} />
                    <lineBasicMaterial color="white" transparent opacity={0.15} />
                </line>
            )}

            <group ref={groupRef}>
                <group rotation={[THREE.MathUtils.degToRad(tilt), 0, 0]}>
                    <mesh
                        ref={meshRef}
                        onPointerOver={() => setHovered(true)}
                        onPointerOut={() => setHovered(false)}
                        onClick={(e) => {
                            e.stopPropagation();
                            onSelect(planet);
                        }}
                    >
                        <sphereGeometry args={[size, 64, 64]} />
                        <meshStandardMaterial
                            color={color}
                            roughness={0.6}
                            metalness={0.4}
                            emissive={selected ? color : 'black'}
                            emissiveIntensity={selected ? 0.3 : 0}
                        />

                        {/* Atmospheric Glow */}
                        <mesh scale={[1.15, 1.15, 1.15]}>
                            <sphereGeometry args={[size, 32, 32]} />
                            <meshStandardMaterial
                                color={color}
                                transparent
                                opacity={0.1}
                                side={THREE.BackSide}
                            />
                        </mesh>

                        {/* Jupiter Storms simulation (simplified shader-like look with multiple spheres) */}
                        {name === "Jupiter" && (
                            <mesh scale={[1.002, 1.002, 1.002]}>
                                <sphereGeometry args={[size, 32, 32]} />
                                <meshStandardMaterial color="#ffffff" transparent opacity={0.1} wireframe />
                            </mesh>
                        )}

                        {hasRings && (
                            <group rotation={[Math.PI / 2, 0, 0]}>
                                <mesh rotation={[0, 0, 0.5]}>
                                    <ringGeometry args={[size * 1.4, size * 2.5, 64]} />
                                    <meshStandardMaterial
                                        color="#fef3c7"
                                        transparent
                                        opacity={0.4}
                                        side={THREE.DoubleSide}
                                        metalness={0.6}
                                        roughness={0.4}
                                    />
                                </mesh>
                            </group>
                        )}
                    </mesh>

                    {/* Satellites */}
                    {satellites.map((s, i) => (
                        <Satellite key={i} satellite={s} parentSize={size} timeScale={timeScale} />
                    ))}
                </group>

                {/* Hover Label */}
                {(hovered || selected) && (
                    <Html distanceFactor={15} position={[0, size + 1, 0]}>
                        <div style={{
                            background: 'rgba(15,23,42,0.9)',
                            color: 'white',
                            padding: '6px 14px',
                            borderRadius: '12px',
                            fontSize: '11px',
                            fontWeight: '900',
                            textTransform: 'uppercase',
                            letterSpacing: '2px',
                            border: `2px solid ${color}`,
                            whiteSpace: 'nowrap',
                            boxShadow: `0 0 20px ${color}40`,
                            pointerEvents: 'none',
                            transform: 'translate(-50%, -100%)'
                        }}>
                            {name} {selected && "• ACTIVE SCAN"}
                        </div>
                    </Html>
                )}
            </group>
        </group>
    );
};

const Sun = () => {
    const meshRef = useRef();
    const lightRef = useRef();

    const uniforms = useMemo(() => ({
        time: { value: 0 },
    }), []);

    useFrame(({ clock }) => {
        uniforms.time.value = clock.getElapsedTime() * 0.5;
        if (meshRef.current) meshRef.current.rotation.y += 0.002;
    });

    return (
        <group>
            <mesh ref={meshRef}>
                <sphereGeometry args={[6, 64, 64]} />
                <shaderMaterial
                    vertexShader={sunVertexShader}
                    fragmentShader={sunFragmentShader}
                    uniforms={uniforms}
                    transparent
                />
            </mesh>
            <pointLight ref={lightRef} intensity={5000} distance={1000} color="#ffde21" />
            <mesh scale={1.2}>
                <sphereGeometry args={[6, 32, 32]} />
                <meshStandardMaterial color="#fcd34d" transparent opacity={0.05} side={THREE.BackSide} />
            </mesh>
        </group>
    );
};

const AsteroidBelt = () => {
    const count = 1200;
    const items = useMemo(() => {
        const arr = [];
        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const radius = 42 + Math.random() * 8;
            const x = Math.cos(angle) * (radius + (Math.random() - 0.5) * 5);
            const z = Math.sin(angle) * (radius + (Math.random() - 0.5) * 5);
            const y = (Math.random() - 0.5) * 3;
            arr.push({ position: [x, y, z], scale: 0.02 + Math.random() * 0.15, rotation: [Math.random(), Math.random(), Math.random()] });
        }
        return arr;
    }, []);

    return (
        <group>
            {items.map((item, i) => (
                <mesh key={i} position={item.position} scale={item.scale} rotation={item.rotation}>
                    <icosahedronGeometry args={[1, 0]} />
                    <meshStandardMaterial color="#71717a" roughness={1} metalness={0.2} />
                </mesh>
            ))}
        </group>
    );
};

const GalaxyParticles = () => (
    <Sparkles count={5000} scale={250} size={1} speed={0.2} color="#818cf8" opacity={0.2} />
);

// ─── CAMERA CONTROLLER ───────────────────────────────────────────────

const CameraController = ({ targetPlanet, cameraMode }) => {
    const { camera, controls } = useThree();

    useEffect(() => {
        if (!targetPlanet || !controls) return;

        // Calculate offset based on planet size
        const targetPos = new THREE.Vector3(targetPlanet.distance, 0, 0); // Approx
        const offset = targetPlanet.size * 5 + 5;

        gsap.to(camera.position, {
            x: targetPlanet.distance + offset,
            y: offset,
            z: offset,
            duration: 1.5,
            ease: "power2.inOut"
        });

        gsap.to(controls.target, {
            x: targetPlanet.distance,
            y: 0,
            z: 0,
            duration: 1.5,
            ease: "power2.inOut"
        });
    }, [targetPlanet, controls]);

    return null;
};

// ─── MAIN APP COMPONENT ──────────────────────────────────────────────

const SolarSystem = ({ setActiveTab }) => {
    const [selectedPlanet, setSelectedPlanet] = useState(null);
    const [timeScale, setTimeScale] = useState(1);
    const [showOrbits, setShowOrbits] = useState(true);
    const [cameraMode, setCameraMode] = useState('free'); // free, focus
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setIsLoaded(true), 1500);
        return () => clearTimeout(timer);
    }, []);

    const resetCamera = () => {
        setSelectedPlanet(null);
        setCameraMode('free');
        // Reset Logic handled via effect in children
    };

    return (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: '#000', overflow: 'hidden', color: 'white', fontFamily: "'Outfit', sans-serif" }}>

            {/* Cinematic Fade Intro */}
            <AnimatePresence>
                {!isLoaded && (
                    <motion.div
                        initial={{ opacity: 1 }} exit={{ opacity: 0 }}
                        style={{ position: 'fixed', inset: 0, background: '#000', zIndex: 5000, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
                    >
                        <motion.div
                            animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            style={{ fontSize: '1rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '8px', color: '#6366f1' }}
                        >
                            Loading Cosmic Systems...
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* 3D Canvas */}
            <Canvas shadows gl={{ antialias: true }}>
                <PerspectiveCamera makeDefault position={[0, 80, 150]} fov={45} />
                <OrbitControls
                    makeDefault
                    enableDamping={true}
                    dampingFactor={0.05}
                    maxDistance={400}
                    minDistance={10}
                    maxPolarAngle={Math.PI / 1.5}
                />

                <ambientLight intensity={0.15} />

                <Suspense fallback={null}>
                    <Sun />
                    <AsteroidBelt />
                    <GalaxyParticles />
                    {PLANETS_DATA.map((p) => (
                        <Planet
                            key={p.name}
                            planet={p}
                            timeScale={timeScale}
                            onSelect={setSelectedPlanet}
                            selected={selectedPlanet?.name === p.name}
                            showOrbits={showOrbits}
                        />
                    ))}
                    <Stars radius={300} depth={100} count={30000} factor={6} saturation={0} fade speed={0.5} />
                    <CameraController targetPlanet={selectedPlanet} cameraMode={cameraMode} />

                    <EffectComposer disableNormalPass>
                        <Bloom luminanceThreshold={0.5} mipmapBlur intensity={1.5} radius={0.4} />
                        <Vignette eskil={false} offset={0.1} darkness={1.3} />
                        <Noise opacity={0.05} />
                    </EffectComposer>
                </Suspense>
            </Canvas>

            {/* UI Overlay: NASA HUD STYLE */}
            <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 100 }}>

                {/* TOP BAR */}
                <div style={{ padding: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', pointerEvents: 'auto' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                        <button
                            onClick={() => setActiveTab('resources')}
                            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', padding: '10px 20px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '10px', backdropFilter: 'blur(10px)', cursor: 'pointer', fontWeight: 900, fontSize: '0.8rem' }}
                        >
                            <ArrowLeft size={16} /> ABORT SIMULATION
                        </button>
                    </div>

                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '0.7rem', color: '#6366f1', fontWeight: 900, letterSpacing: '5px', textTransform: 'uppercase', marginBottom: '8px' }}>Deep Space Network v2.0</div>
                        <h1 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '4px', textShadow: '0 0 20px rgba(99,102,241,0.5)' }}>Solar System <span style={{ color: '#fff' }}>Simulation</span></h1>
                    </div>

                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button onClick={resetCamera} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', padding: '10px 20px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: 800 }}>
                            <Compass size={16} /> RESET CAMERA
                        </button>
                    </div>
                </div>

                {/* LEFT CONTROLS */}
                <div style={{ position: 'absolute', left: '2rem', top: '50%', transform: 'translateY(-50%)', display: 'flex', flexDirection: 'column', gap: '1rem', pointerEvents: 'auto' }}>
                    {[
                        { id: 'orbits', icon: <Layers size={20} />, label: 'Orbit Paths', active: showOrbits, action: () => setShowOrbits(!showOrbits) },
                        { id: 'info', icon: <Info size={20} />, label: 'HUD Overlay', active: true, action: () => { } },
                    ].map(item => (
                        <button
                            key={item.id}
                            onClick={item.action}
                            style={{ width: '48px', height: '48px', borderRadius: '14px', background: item.active ? '#6366f1' : 'rgba(15,23,42,0.8)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', backdropFilter: 'blur(10px)', transition: '0.3s' }}
                            title={item.label}
                        >
                            {item.icon}
                        </button>
                    ))}
                </div>

                {/* BOTTOM TIME CONTROL */}
                <div style={{ position: 'absolute', bottom: '2rem', left: '50%', transform: 'translateX(-50%)', pointerEvents: 'auto', display: 'flex', alignItems: 'center', gap: '2rem', background: 'rgba(15,23,42,0.8)', padding: '15px 40px', borderRadius: '24px', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.1)' }}>
                    <button onClick={() => setTimeScale(Math.max(0, timeScale - 0.5))} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}><Rewind size={24} /></button>
                    <div style={{ textAlign: 'center', minWidth: '120px' }}>
                        <div style={{ fontSize: '0.6rem', color: '#6366f1', fontWeight: 900, textTransform: 'uppercase', marginBottom: '5px' }}>Temporal Scaling</div>
                        <div style={{ fontSize: '1.2rem', fontWeight: 900 }}>{timeScale.toFixed(1)}x <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>SPD</span></div>
                    </div>
                    <button onClick={() => setTimeScale(Math.min(5, timeScale + 0.5))} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}><FastForward size={24} /></button>
                </div>

                {/* RIGHT HUD: NASA DATA PANEL */}
                <AnimatePresence>
                    {selectedPlanet && (
                        <motion.div
                            initial={{ x: 500, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: 500, opacity: 0 }}
                            style={{
                                position: 'absolute', right: '2rem', top: '100px', bottom: '100px', width: '380px',
                                background: 'linear-gradient(180deg, rgba(15,23,42,0.95) 0%, rgba(15,23,42,0.85) 100%)',
                                borderLeft: '3px solid #6366f1', borderRadius: '32px 0 0 32px',
                                padding: '3rem', pointerEvents: 'auto', backdropFilter: 'blur(30px)',
                                overflowY: 'auto', boxShadow: '-30px 0 50px rgba(0,0,0,0.5)'
                            }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                                <div>
                                    <div style={{ fontSize: '0.7rem', color: '#6366f1', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '4px' }}>Target Identification</div>
                                    <h2 style={{ fontSize: '2.8rem', fontWeight: 900, margin: 0, color: '#fff' }}>{selectedPlanet.name}</h2>
                                </div>
                                <button onClick={() => setSelectedPlanet(null)} style={{ background: 'rgba(255,255,255,0.05)', border: 'none', borderRadius: '50%', width: '40px', height: '40px', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <X size={20} />
                                </button>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '3rem' }}>
                                {Object.entries(selectedPlanet.data).map(([key, val]) => (
                                    <div key={key} style={{ padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                        <div style={{ fontSize: '0.6rem', color: '#64748b', fontWeight: 900, textTransform: 'uppercase', marginBottom: '6px' }}>{key}</div>
                                        <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#f1f5f9' }}>{val}</div>
                                    </div>
                                ))}
                            </div>

                            <div style={{ background: '#6366f115', border: '1px solid #6366f140', padding: '1.5rem', borderRadius: '24px', marginBottom: '2rem', position: 'relative' }}>
                                <Map size={18} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', color: '#6366f1' }} />
                                <h4 style={{ margin: '0 0 10px 0', fontSize: '0.9rem', fontWeight: 900, color: '#6366f1' }}>Atmospheric Analysis</h4>
                                <p style={{ margin: 0, fontSize: '0.85rem', color: '#94a3b8', lineHeight: 1.6 }}>{selectedPlanet.data.atmosphere}</p>
                            </div>

                            <div style={{ fontSize: '0.85rem', color: '#cbd5e1', lineHeight: 1.8, marginBottom: '3rem' }}>
                                {selectedPlanet.name === "Earth" ? "Earth is our home planet. It is the only planet in our solar system that has liquid water on its surface." :
                                    selectedPlanet.name === "Jupiter" ? "Jupiter is the largest planet in the solar system. It is approximately 318 times as massive as Earth." :
                                        "Planetary simulation active. Analyzing structural integrity and chemical composition through deep-space sensors."}
                            </div>

                            <button style={{ width: '100%', padding: '1.2rem', background: '#6366f1', color: 'white', border: 'none', borderRadius: '16px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '2px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
                                <Maximize2 size={18} /> Surface Scan Mode
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>

            </div>

        </div>
    );
};

export default SolarSystem;
