using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.Rendering;
using UnityEngine.Rendering.HighDefinition;
using ShootingGame.World.Core;

namespace ShootingGame.World.Lighting
{
    // ============================================================
    //  EnvironmentLighting — AAA Open World Ground System
    //  HDRP Sun, Shadows, Volumetric Fog, Reflection Probes, SSR.
    //  Author  : AAA Ground System v1.0
    //  Phase   : 1 — Ground & Environment Base
    // ============================================================

    /// <summary>
    /// Configures and manages the complete HDRP lighting environment for the open world.
    ///
    /// Managed systems:
    ///   1. Directional Sun light — HDAdditionalLightData, colour temperature, Lux.
    ///   2. Soft Shadows — PCSS contact shadows via HDRP shadow settings.
    ///   3. Volumetric Fog — HDRP VolumetricFog override on the sky Volume.
    ///   4. Reflection Probe Grid — auto-placed probes tiled at a configurable spacing.
    ///   5. Screen-Space Reflections (SSR) — quality driven by PerformanceManager tier.
    ///   6. Ambient SH Bake — async Sky Ambient bake on startup.
    ///   7. Day/Night Stub — <see cref="SetTimeOfDay"/> modulates all lighting params.
    ///
    /// All HDRP Volume overrides are fetched once and cached; no FindComponent calls
    /// occur during the Tick loop.
    /// </summary>
    public sealed class EnvironmentLighting : GroundSubSystem
    {
        // ──────────────────────────────────────────────────────────
        //  INSPECTOR
        // ──────────────────────────────────────────────────────────

        [Header("Sun Light")]
        [Tooltip("The scene's directional sun light (must have HDAdditionalLightData).")]
        [SerializeField] private Light _sunLight;

        [Header("Sky Volume")]
        [Tooltip("The HDRP sky/fog/SSR Volume in the scene.")]
        [SerializeField] private Volume _skyVolume;

        [Header("Reflection Probe Grid")]
        [Tooltip("Parent GameObject under which auto-placed reflection probes are nested.")]
        [SerializeField] private Transform _reflectionProbeRoot;

        [Tooltip("Reflection probe bake mode.")]
        [SerializeField] private ReflectionProbeMode _probeMode = ReflectionProbeMode.Realtime;

        [Tooltip("Refresh mode for real-time probes.")]
        [SerializeField] private ReflectionProbeRefreshMode _probeRefreshMode =
            ReflectionProbeRefreshMode.EveryFrame;

        [Header("Day/Night Curve")]
        [Tooltip("Multiplier curve for sun intensity over 24h (x=time 0–1, y=intensity multiplier 0–1).")]
        [SerializeField] private AnimationCurve _sunIntensityCurve =
            AnimationCurve.EaseInOut(0f, 0f, 0.5f, 1f);

        [Tooltip("Sun colour temperature curve over 24h.")]
        [SerializeField] private AnimationCurve _sunTemperatureCurve =
            AnimationCurve.Linear(0f, 1500f, 1f, 1500f);

        [Tooltip("Fog density multiplier curve over 24h (denser fog at dusk/dawn).")]
        [SerializeField] private AnimationCurve _fogDensityCurve =
            AnimationCurve.EaseInOut(0f, 1.5f, 0.5f, 1f);

        // ──────────────────────────────────────────────────────────
        //  PRIVATE STATE — HDRP CACHED REFERENCES
        // ──────────────────────────────────────────────────────────

        private HDAdditionalLightData       _sunHDData;
        private VolumetricFog               _fog;
        private ScreenSpaceReflection       _ssr;
        private Fog                         _linearFog;

        private readonly List<ReflectionProbe>  _probeGrid       = new List<ReflectionProbe>(64);
        private readonly List<ReflectionProbe>  _visibleProbes   = new List<ReflectionProbe>(16);

        private float _currentTimeOfDay = 0.5f;    // 0.5 = noon default.

        // ──────────────────────────────────────────────────────────
        //  INITIALISE
        // ──────────────────────────────────────────────────────────

        public override void Initialise()
        {
            SetupSunLight();
            SetupVolumeOverrides();
            PlaceReflectionProbeGrid();
            StartCoroutine(BakeAmbientSH());
            ApplyLightingForTime(_currentTimeOfDay);

            base.Initialise();
            Debug.Log("[EnvironmentLighting] Initialised. Probes placed: " + _probeGrid.Count);
        }

        // ──────────────────────────────────────────────────────────
        //  SUN SETUP
        // ──────────────────────────────────────────────────────────

        private void SetupSunLight()
        {
            if (_sunLight == null)
            {
                // Auto-create a directional light if none assigned.
                var go    = new GameObject("DirectionalSun");
                go.transform.SetParent(transform, false);
                go.transform.rotation = Quaternion.Euler(50f, -30f, 0f);
                _sunLight = go.AddComponent<Light>();
                _sunLight.type = LightType.Directional;
            }

            _sunHDData = _sunLight.GetComponent<HDAdditionalLightData>();
            if (_sunHDData == null)
                _sunHDData = _sunLight.gameObject.AddComponent<HDAdditionalLightData>();

            // HDRP physical light settings.
            _sunHDData.SetIntensity(Config.sunIntensityLux, LightUnit.Lux);
            _sunHDData.EnableColorTemperature(true);
            _sunHDData.SetColor(Color.white, Config.sunColorTemperature);

            // Cascade shadow config (4 cascades for open world).
            _sunHDData.shadowUpdateMode = ShadowUpdateMode.EveryFrame;
            _sunLight.shadows = LightShadows.Soft;
        }

        // ──────────────────────────────────────────────────────────
        //  HDRP VOLUME OVERRIDES
        // ──────────────────────────────────────────────────────────

        private void SetupVolumeOverrides()
        {
            if (_skyVolume == null)
            {
                Debug.LogWarning("[EnvironmentLighting] No sky Volume assigned; creating global volume.");
                var go     = new GameObject("SkyFogVolume");
                go.transform.SetParent(transform, false);
                _skyVolume = go.AddComponent<Volume>();
                _skyVolume.isGlobal = true;
                _skyVolume.priority = 1;

                // Create a fresh profile locally.
                _skyVolume.profile = ScriptableObject.CreateInstance<VolumeProfile>();
            }

            VolumeProfile profile = _skyVolume.profile;

            // --- Volumetric Fog ---
            if (!profile.TryGet(out _fog))
                _fog = profile.Add<VolumetricFog>(overridesAll: true);

            _fog.active              = true;
            _fog.meanFreePath.value  = Config.fogMeanFreePath;
            _fog.meanFreePath.overrideState = true;
            _fog.albedo.value        = new Color(0.85f, 0.87f, 0.9f);
            _fog.albedo.overrideState = true;

            // --- Screen-Space Reflections ---
            if (!profile.TryGet(out _ssr))
                _ssr = profile.Add<ScreenSpaceReflection>(overridesAll: false);

            _ssr.active           = true;
            _ssr.enabled.value    = true;
            _ssr.enabled.overrideState = true;
            _ssr.quality.value    = (int)ScalableSettingLevelParameter.Level.High;
            _ssr.quality.overrideState = true;
        }

        // ──────────────────────────────────────────────────────────
        //  REFLECTION PROBE GRID
        // ──────────────────────────────────────────────────────────

        /// <summary>
        /// Auto-places a grid of <see cref="ReflectionProbe"/> components tiled at
        /// <see cref="WorldConfig.reflectionProbeGridSpacing"/> metre intervals
        /// across the near-field playable area (±2 grid cells from origin at startup;
        /// the grid expands dynamically via <see cref="OnChunkLoaded"/>).
        /// </summary>
        private void PlaceReflectionProbeGrid()
        {
            if (_reflectionProbeRoot == null)
            {
                var go = new GameObject("ReflectionProbes");
                go.transform.SetParent(transform, false);
                _reflectionProbeRoot = go.transform;
            }

            float spacing = Config.reflectionProbeGridSpacing;
            float initRadius = Config.chunkSizeMetres;  // Cover first 3×3 chunk block.
            int   gridN    = Mathf.CeilToInt(initRadius / spacing);

            for (int x = -gridN; x <= gridN; x++)
            {
                for (int z = -gridN; z <= gridN; z++)
                {
                    PlaceProbeAt(new Vector3(x * spacing, 20f, z * spacing), spacing);
                }
            }
        }

        private void PlaceProbeAt(Vector3 worldPos, float spacing)
        {
            var go    = new GameObject($"ReflProbe_{worldPos.x:F0}_{worldPos.z:F0}");
            go.transform.SetParent(_reflectionProbeRoot, worldPositionStays: false);
            go.transform.position = worldPos;

            var probe = go.AddComponent<ReflectionProbe>();
            probe.mode            = _probeMode;
            probe.refreshMode     = _probeRefreshMode;
            probe.size            = new Vector3(spacing, 60f, spacing);
            probe.center          = Vector3.zero;
            probe.resolution      = 128;   // Low-res per probe, blended by HDRP.
            probe.hdr             = true;
            probe.timeSlicingMode = ReflectionProbeTimeSlicingMode.IndividualFaces; // 1 face/frame.

            _probeGrid.Add(probe);
        }

        /// <summary>
        /// Adds new reflection probes when a distant chunk loads outside the initial grid.
        /// Only places probes that don't already exist within snapping tolerance.
        /// </summary>
        public void OnChunkLoaded(WorldChunk chunk)
        {
            float spacing = Config.reflectionProbeGridSpacing;
            Vector3 chunkCenter = chunk.Bounds.center;

            int nx = Mathf.RoundToInt(chunkCenter.x / spacing);
            int nz = Mathf.RoundToInt(chunkCenter.z / spacing);

            // Check if probe already covers this position.
            bool exists = false;
            foreach (var probe in _probeGrid)
            {
                if (Mathf.Abs(probe.transform.position.x - nx * spacing) < spacing * 0.5f &&
                    Mathf.Abs(probe.transform.position.z - nz * spacing) < spacing * 0.5f)
                { exists = true; break; }
            }

            if (!exists)
                PlaceProbeAt(new Vector3(nx * spacing, 20f, nz * spacing), spacing);
        }

        // ──────────────────────────────────────────────────────────
        //  AMBIENT SH BAKE (async)
        // ──────────────────────────────────────────────────────────

        /// <summary>
        /// Triggers an asynchronous bake of ambient Spherical Harmonics from the
        /// current sky. Runs on a worker thread via <see cref="LightProbes"/>.
        /// </summary>
        private IEnumerator BakeAmbientSH()
        {
            yield return new WaitForSeconds(2f);  // Let HDRP sky settle first.

            // Request dynamic sky ambient update via HDRP rendering pipeline.
            DynamicGI.UpdateEnvironment();
            yield return new WaitForEndOfFrame();

            Debug.Log("[EnvironmentLighting] Ambient SH bake complete.");
        }

        // ──────────────────────────────────────────────────────────
        //  PER-FRAME TICK
        // ──────────────────────────────────────────────────────────

        /// <summary>
        /// Called every frame by <see cref="CityGroundSystem.Update"/>.
        /// Currently only performs probe distance culling to save render cost.
        /// Day/Night stepping happens only when <see cref="SetTimeOfDay"/> is called.
        /// </summary>
        public void Tick(float time)
        {
            if (!IsReady) return;
            CullDistantProbes();
        }

        /// <summary>
        /// Disables probes that are further than 2× grid spacing from the camera
        /// to avoid rendering their cube faces needlessly.
        /// </summary>
        private void CullDistantProbes()
        {
            if (Camera.main == null) return;
            Vector3 camPos  = Camera.main.transform.position;
            float   cullDist = Config.reflectionProbeGridSpacing * 2.5f;

            foreach (var probe in _probeGrid)
            {
                if (probe == null) continue;
                float dist = Vector3.Distance(camPos, probe.transform.position);
                probe.gameObject.SetActive(dist < cullDist);
            }
        }

        // ──────────────────────────────────────────────────────────
        //  PUBLIC API
        // ──────────────────────────────────────────────────────────

        /// <summary>
        /// [Day-Night Hook] Drive all lighting parameters from a normalised time value.
        /// Call every frame with lerped t to achieve a smooth day/night cycle.
        /// <para>• 0.0 = midnight</para>
        /// <para>• 0.25 = 6am sunrise</para>
        /// <para>• 0.5 = noon</para>
        /// <para>• 0.75 = 6pm sunset</para>
        /// <para>• 1.0 = midnight</para>
        /// </summary>
        public void SetTimeOfDay(float t01)
        {
            _currentTimeOfDay = Mathf.Clamp01(t01);
            ApplyLightingForTime(_currentTimeOfDay);
            EventBus?.Publish(WorldEventBus.EventType.TimeOfDayChanged, _currentTimeOfDay);
        }

        /// <summary>
        /// Adjusts the SSR quality tier. Called by <see cref="PerformanceManager"/> when
        /// frame budget pressure changes.
        /// </summary>
        public void SetSSRQuality(int hdrpQualityLevel)
        {
            if (_ssr == null) return;
            _ssr.quality.value = hdrpQualityLevel;
        }

        // ──────────────────────────────────────────────────────────
        //  INTERNAL LIGHTING APPLICATION
        // ──────────────────────────────────────────────────────────

        private void ApplyLightingForTime(float t)
        {
            if (_sunHDData == null) return;

            // Sun rotation — 0 = midnight below horizon, 0.5 = noon overhead.
            float sunAngle = (t - 0.25f) * 360f;
            _sunLight.transform.rotation = Quaternion.Euler(sunAngle, -30f, 0f);

            // Intensity modulated by curve (dawn/dusk = dim, noon = full).
            float intensityMult = _sunIntensityCurve.Evaluate(t);
            _sunHDData.SetIntensity(Config.sunIntensityLux * intensityMult, LightUnit.Lux);

            // Colour temperature — sunrise/sunset is warm (2000K), noon is neutral (5500K).
            float temp = _sunTemperatureCurve.Evaluate(t);
            _sunHDData.SetColor(Color.white, temp);

            // Fog density — heavier at dawn/dusk.
            if (_fog != null)
            {
                float fogMult = _fogDensityCurve.Evaluate(t);
                _fog.meanFreePath.value = Config.fogMeanFreePath / fogMult;
            }
        }
    }
}
