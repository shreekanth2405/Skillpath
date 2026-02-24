using System.Collections.Generic;
using UnityEngine;
using ShootingGame.World.Core;

namespace ShootingGame.World.Animation
{
    // ============================================================
    //  GroundAnimationController — AAA Open World Ground System
    //  GPU-driven wind, wetness, shimmer, puddle, dust animations.
    //  Author  : AAA Ground System v1.0
    //  Phase   : 1 — Ground & Environment Base
    // ============================================================

    /// <summary>
    /// Manages all real-time GPU-side ground animations for the open world.
    /// Every animation effect is driven via shader uniform pushes or lightweight
    /// CPU-side orchestration of GPU particle systems — no expensive per-vertex
    /// CPU loops exist in this class.
    ///
    /// Systems managed:
    ///   1. Wind — sinusoidal vertex displacement for grass / foliage shaders.
    ///   2. Wetness Transition — smooth interpolation of _WetFactor / _Roughness uniforms.
    ///   3. Puddle Ripple — UV-animated ring SDF pushed via shader globals.
    ///   4. Surface Shimmer — screen-space UV noise animated by _Time (fully in shader,
    ///      CPU only seeds the RNG on material assign).
    ///   5. Ambient Dust — GPU-instanced billboard particle system above terrain.
    ///
    /// All public methods are safe to call from <see cref="CityGroundSystem"/> Update
    /// per-frame at negligible cost.
    /// </summary>
    public sealed class GroundAnimationController : GroundSubSystem
    {
        // ──────────────────────────────────────────────────────────
        //  SHADER PROPERTY IDs (cached at Initialise — no per-frame string hash)
        // ──────────────────────────────────────────────────────────

        private static readonly int ID_WindDirection  = Shader.PropertyToID("_WindDirection");
        private static readonly int ID_WindStrength   = Shader.PropertyToID("_WindStrength");
        private static readonly int ID_WindFrequency  = Shader.PropertyToID("_WindFrequency");
        private static readonly int ID_WetFactor      = Shader.PropertyToID("_WetFactor");
        private static readonly int ID_PuddleCoverage = Shader.PropertyToID("_PuddleCoverage");
        private static readonly int ID_RippleTime     = Shader.PropertyToID("_RippleTime");
        private static readonly int ID_RippleOrigin   = Shader.PropertyToID("_RippleOrigin");
        private static readonly int ID_RippleRadius   = Shader.PropertyToID("_RippleRadius");
        private static readonly int ID_ShimmerSeed    = Shader.PropertyToID("_ShimmerSeed");
        private static readonly int ID_GlobalTime     = Shader.PropertyToID("_GroundGlobalTime");

        // ──────────────────────────────────────────────────────────
        //  INSPECTOR
        // ──────────────────────────────────────────────────────────

        [Header("Wind")]
        [Tooltip("Wind direction as XZ vector (automatically normalised at runtime).")]
        [SerializeField] private Vector2 _windDirection = new Vector2(1f, 0.3f);

        [Tooltip("Wind speed scalar — drives the sine wave frequency.")]
        [SerializeField] [Range(0f, 5f)] private float _windSpeed = 1.2f;

        [Tooltip("Angular frequency of the wind sine wave (radians per metre).")]
        [SerializeField] [Range(0.1f, 10f)] private float _windFrequency = 1.5f;

        [Header("Wetness")]
        [Tooltip("Current wetness 0=dry 1=fully wet. Normally driven by SetWetness().")]
        [SerializeField] [Range(0f, 1f)] private float _targetWetness;

        [Tooltip("Seconds to linearly interpolate between dry and wet states.")]
        [SerializeField] private float _wetnessFadeDuration = 8f;

        [Header("Puddle Ripple")]
        [Tooltip("Maximum radius a ripple ring expands to (metres in world space).")]
        [SerializeField] private float _rippleMaxRadius = 3f;

        [Tooltip("Seconds for one ripple cycle (expand + fade).")]
        [SerializeField] private float _rippleCycleDuration = 1.2f;

        [Tooltip("How many puddle ripple emitters to place across a loaded chunk.")]
        [SerializeField] [Range(1, 16)] private int _rippleEmitterCount = 6;

        [Header("Ambient Dust")]
        [Tooltip("Particle system used for ambient ground dust. Must be GPU-instanced billboard.")]
        [SerializeField] private ParticleSystem _dustParticleSystem;

        [Tooltip("Emission rate when the world is completely dry (particles/sec).")]
        [SerializeField] private float _dustEmissionDry = 20f;

        [Tooltip("Emission rate when the world is fully wet (suppressed).")]
        [SerializeField] private float _dustEmissionWet = 0f;

        [Header("Tracked Materials")]
        [Tooltip("All ground materials that receive wind / wetness uniforms. " +
                 "Register via AddTrackedMaterial() at runtime or pre-assign here.")]
        [SerializeField] private List<Material> _trackedMaterials = new List<Material>();

        // ──────────────────────────────────────────────────────────
        //  PRIVATE STATE
        // ──────────────────────────────────────────────────────────

        private float _currentWetness;
        private float _rippleTimer;

        /// <summary>World-space origins of active puddle ripple emitters (randomised per chunk).</summary>
        private readonly List<Vector3> _rippleEmitters = new List<Vector3>(16);

        // ──────────────────────────────────────────────────────────
        //  INITIALISE
        // ──────────────────────────────────────────────────────────

        public override void Initialise()
        {
            _currentWetness = Config.defaultWetness;
            _targetWetness  = _currentWetness;
            _windDirection  = Config.windDirection;
            _windSpeed      = Config.windSpeed;
            _wetnessFadeDuration = Config.wetnessFadeDuration;

            // Seed shimmer in all tracked materials at startup.
            System.Random rng = new System.Random(Config.worldSeed);
            foreach (Material mat in _trackedMaterials)
                mat.SetFloat(ID_ShimmerSeed, (float)(rng.NextDouble() * 100.0));

            // Configure dust particle system for GPU instancing.
            if (_dustParticleSystem != null)
            {
                var renderer = _dustParticleSystem.GetComponent<ParticleSystemRenderer>();
                renderer.renderMode = ParticleSystemRenderMode.Billboard;
                renderer.enableGPUInstancing = true;
            }

            PushAllUniforms(0f);
            base.Initialise();
            Debug.Log("[GroundAnimationController] Initialised. Tracked materials: " + _trackedMaterials.Count);
        }

        // ──────────────────────────────────────────────────────────
        //  PER-FRAME TICK (called by CityGroundSystem.Update)
        // ──────────────────────────────────────────────────────────

        /// <summary>
        /// Main per-frame driver.  Interpolates continuous state and pushes
        /// all shader globals in a single pass — O(M) where M = material count.
        /// </summary>
        public void Tick(float time, float deltaTime)
        {
            if (!IsReady) return;

            UpdateWetnessTransition(deltaTime);
            UpdateRipple(deltaTime, time);
            UpdateDustEmission();
            PushAllUniforms(time);
        }

        // ──────────────────────────────────────────────────────────
        //  WETNESS
        // ──────────────────────────────────────────────────────────

        private void UpdateWetnessTransition(float dt)
        {
            _currentWetness = Mathf.MoveTowards(
                _currentWetness, _targetWetness,
                dt / Mathf.Max(0.01f, _wetnessFadeDuration));
        }

        /// <summary>
        /// [Weather Hook] Drives the world wetness. 0 = bone dry, 1 = fully soaked.
        /// Triggers smooth interpolation over <see cref="_wetnessFadeDuration"/> seconds.
        /// </summary>
        public void SetWetness(float wet01)
        {
            _targetWetness = Mathf.Clamp01(wet01);
            EventBus?.Publish(WorldEventBus.EventType.WetnessChanged, _targetWetness);
        }

        // ──────────────────────────────────────────────────────────
        //  PUDDLE RIPPLE
        // ──────────────────────────────────────────────────────────

        private void UpdateRipple(float dt, float time)
        {
            _rippleTimer += dt;
            if (_rippleTimer > _rippleCycleDuration)
                _rippleTimer -= _rippleCycleDuration;

            float phase = _rippleTimer / _rippleCycleDuration;
            float radius = phase * _rippleMaxRadius;
            float fade   = 1f - phase;  // Ring fades as it expands.

            // Push per-emitter ripple to shader globals (only first emitter for global,
            // multi-emitter support done inside shader via array if needed in future).
            if (_rippleEmitters.Count > 0)
            {
                Shader.SetGlobalVector(ID_RippleOrigin, _rippleEmitters[0]);
                Shader.SetGlobalFloat(ID_RippleRadius, radius);
                Shader.SetGlobalFloat(ID_RippleTime, phase);
            }
        }

        // ──────────────────────────────────────────────────────────
        //  DUST PARTICLES
        // ──────────────────────────────────────────────────────────

        private void UpdateDustEmission()
        {
            if (_dustParticleSystem == null) return;
            var emission = _dustParticleSystem.emission;
            emission.rateOverTime = Mathf.Lerp(_dustEmissionDry, _dustEmissionWet, _currentWetness);
        }

        // ──────────────────────────────────────────────────────────
        //  SHADER UNIFORM PUSH
        // ──────────────────────────────────────────────────────────

        /// <summary>
        /// Pushes all animated uniforms as Shader globals so every material that
        /// reads these properties is updated in ONE pass instead of per-material.
        /// </summary>
        private void PushAllUniforms(float time)
        {
            // --- Wind ---
            Vector2 windDir = _windDirection.normalized;
            float   windStr = _windSpeed * (0.9f + 0.1f * Mathf.Sin(time * 0.3f));  // Subtle gusts.

            Shader.SetGlobalVector(ID_WindDirection, new Vector4(windDir.x, 0f, windDir.y, 0f));
            Shader.SetGlobalFloat(ID_WindStrength,   windStr);
            Shader.SetGlobalFloat(ID_WindFrequency,  _windFrequency);

            // --- Wetness ---
            Shader.SetGlobalFloat(ID_WetFactor,      _currentWetness);
            Shader.SetGlobalFloat(ID_PuddleCoverage, Mathf.Pow(_currentWetness, 1.5f));

            // --- Global Time (shader-side animations) ---
            Shader.SetGlobalFloat(ID_GlobalTime, time);
        }

        // ──────────────────────────────────────────────────────────
        //  RIPPLE EMITTER PLACEMENT
        // ──────────────────────────────────────────────────────────

        /// <summary>
        /// Places randomised puddle ripple emitters across the loaded chunk bounds.
        /// Called by <see cref="CityGroundSystem"/> when a chunk finishes loading.
        /// </summary>
        public void PlaceRippleEmittersForChunk(WorldChunk chunk)
        {
            var rng = new System.Random(chunk.Coord.x * 73856093 ^ chunk.Coord.y * 19349663);

            for (int i = 0; i < _rippleEmitterCount; i++)
            {
                float rx = chunk.Bounds.min.x + (float)rng.NextDouble() * chunk.Bounds.size.x;
                float rz = chunk.Bounds.min.z + (float)rng.NextDouble() * chunk.Bounds.size.z;

                // Only place near low-lying areas (potential puddle zones).
                if (chunk.TerrainComponent != null)
                {
                    float ry = chunk.TerrainComponent.SampleHeight(new Vector3(rx, 0, rz));
                    if (ry < 10f)   // Prefer flat low areas.
                        _rippleEmitters.Add(new Vector3(rx, ry + 0.01f, rz));
                }
            }
        }

        // ──────────────────────────────────────────────────────────
        //  MATERIAL REGISTRY
        // ──────────────────────────────────────────────────────────

        /// <summary>
        /// Adds a material to the tracked list so it receives wind and wetness updates.
        /// Call this when a new chunk's terrain or road mesh is activated.
        /// </summary>
        public void AddTrackedMaterial(Material mat)
        {
            if (mat != null && !_trackedMaterials.Contains(mat))
            {
                _trackedMaterials.Add(mat);
                // Seed shimmer uniquely.
                mat.SetFloat(ID_ShimmerSeed, Random.Range(0f, 100f));
            }
        }

        /// <summary>Removes a material from tracking when its chunk unloads.</summary>
        public void RemoveTrackedMaterial(Material mat)
        {
            _trackedMaterials.Remove(mat);
        }

        // ──────────────────────────────────────────────────────────
        //  WIND DIRECTION CONTROL
        // ──────────────────────────────────────────────────────────

        /// <summary>
        /// [Weather Hook] Changes the wind direction in world space.
        /// Interpolation can be applied by calling this each frame with a lerped value.
        /// </summary>
        public void SetWindDirection(Vector2 xzDirection, float speed)
        {
            _windDirection = xzDirection;
            _windSpeed     = speed;
        }
    }
}
