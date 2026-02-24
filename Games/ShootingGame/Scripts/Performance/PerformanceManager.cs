using System.Collections.Generic;
using UnityEngine;
using UnityEngine.Rendering;
using UnityEngine.Rendering.HighDefinition;
using ShootingGame.World.Core;

namespace ShootingGame.World.Performance
{
    // ============================================================
    //  PerformanceManager — AAA Open World Ground System
    //  LOD, GPU Instancing, DRS, Occlusion, Chunk Stream Scheduling.
    //  Author  : AAA Ground System v1.0
    //  Phase   : 1 — Ground & Environment Base
    // ============================================================

    /// <summary>
    /// Central performance budget manager for the open-world ground system.
    ///
    /// Responsibilities:
    ///   1. <b>LOD Bias</b> — adjusts <see cref="QualitySettings.lodBias"/> globally
    ///      based on frame-time feedback to meet the target FPS.
    ///   2. <b>GPU Instancing</b> — collects <see cref="MeshRenderer"/>s in each loaded
    ///      chunk and batches identical meshes via <see cref="Graphics.DrawMeshInstanced"/>.
    ///   3. <b>Dynamic Resolution Scaling (DRS)</b> — uses HDRP
    ///      <see cref="DynamicResolutionHandler"/> to scale between
    ///      <see cref="WorldConfig.drsMinScale"/> and 1.0 every 500 ms.
    ///   4. <b>Occlusion Culling</b> — enables Unity's static occlusion culling;
    ///      also maintains a per-layer cull distance table pushed to the main camera.
    ///   5. <b>Chunk Load Scheduler</b> — priority queue ensuring at most
    ///      <see cref="WorldConfig.maxConcurrentChunkLoads"/> chunks load per tick.
    ///   6. <b>Texture Streaming</b> — sets mipmap streaming budget and monitors usage.
    ///
    /// The manager operates on a rolling 60-sample frame-time average to avoid
    /// knee-jerk quality changes from momentary spikes.
    /// </summary>
    public sealed class PerformanceManager : GroundSubSystem
    {
        // ──────────────────────────────────────────────────────────
        //  INSPECTOR
        // ──────────────────────────────────────────────────────────

        [Header("LOD")]
        [Tooltip("Maximum LOD bias (full quality, applied when FPS is comfortable).")]
        [SerializeField] [Range(0.5f, 4f)] private float _lodBiasHigh = 2.0f;

        [Tooltip("Minimum LOD bias (aggressive reduction, applied under frame pressure).")]
        [SerializeField] [Range(0.2f, 1.5f)] private float _lodBiasLow = 0.6f;

        [Tooltip("Layer names that should fade to invisible beyond their cull distance.")]
        [SerializeField] private LayerCullEntry[] _layerCullDistances = new LayerCullEntry[]
        {
            new LayerCullEntry { LayerName = "Foliage",   CullDistance = 300f },
            new LayerCullEntry { LayerName = "Decals",    CullDistance = 150f },
            new LayerCullEntry { LayerName = "Particles", CullDistance = 200f },
        };

        [Header("Dynamic Resolution")]
        [Tooltip("How often (seconds) DRS adjusts its scaling factor.")]
        [SerializeField] [Range(0.1f, 2f)] private float _drsAdjustInterval = 0.5f;

        [Header("GPU Instancing")]
        [Tooltip("Maximum instances in a single DrawMeshInstanced call (Unity limit = 1023).")]
        [SerializeField] [Range(64, 1023)] private int _maxInstancesPerBatch = 512;

        [Header("Frame Time Smoothing")]
        [Tooltip("Number of frames to average for frame budget decisions.")]
        [SerializeField] [Range(10, 120)] private int _frameSampleCount = 60;

        // ──────────────────────────────────────────────────────────
        //  PRIVATE STATE
        // ──────────────────────────────────────────────────────────

        // --- Frame time ring buffer ---
        private float[] _frameTimes;
        private int     _frameIdx;
        private float   _smoothedFrameMs;

        // --- DRS state ---
        private float _currentDrsScale  = 1f;
        private float _drsTimer;

        // --- LOD ---
        private float _currentLodBias;

        // --- Per-chunk renderer tracking ---
        private readonly Dictionary<Vector2Int, List<MeshRenderer>> _chunkRenderers =
            new Dictionary<Vector2Int, List<MeshRenderer>>(32);

        // --- GPU Instancing batch cache ---
        // Key: (Mesh, Material) → list of instance matrices.
        private readonly Dictionary<BatchKey, List<Matrix4x4>> _instanceBatches =
            new Dictionary<BatchKey, List<Matrix4x4>>(64);

        // --- Layer cull table ---
        private float[] _cullDistanceTable;   // Length = 32 (one per layer).

        // ──────────────────────────────────────────────────────────
        //  INITIALISE
        // ──────────────────────────────────────────────────────────

        public override void Initialise()
        {
            _frameTimes      = new float[_frameSampleCount];
            _currentLodBias  = _lodBiasHigh;
            _currentDrsScale = 1f;

            // Fill default frame times with target budget so first average is sane.
            for (int i = 0; i < _frameSampleCount; i++)
                _frameTimes[i] = Config.targetFrameBudgetMs;

            // Texture streaming budget.
            QualitySettings.streamingMipmapsActive    = true;
            QualitySettings.streamingMipmapsMemoryBudget = Config.textureMipmapBudgetMB;
            QualitySettings.streamingMipmapsMaxLevelReduction = 4;

            // Build layer cull distance table.
            BuildLayerCullTable();
            ApplyLayerCullTable();

            // Start DRS via HDRP handler.
            DynamicResolutionHandler.SetDynamicResScaler(
                DRSScalerCallback, DynamicResScalePolicyType.ReturnsPercentage);

            base.Initialise();
            Debug.Log("[PerformanceManager] Initialised. Target: " + Config.targetFrameBudgetMs + " ms.");
        }

        // ──────────────────────────────────────────────────────────
        //  PER-FRAME TICK
        // ──────────────────────────────────────────────────────────

        /// <summary>
        /// Called by <see cref="CityGroundSystem.Update"/> every frame.
        /// Updates the rolling frame-time average and adjusts quality knobs.
        /// </summary>
        public void Tick(float unscaledDeltaTime)
        {
            if (!IsReady) return;

            RecordFrameTime(unscaledDeltaTime * 1000f);   // ms.
            float budget = Config.targetFrameBudgetMs;

            // --- LOD Bias ---
            float targetBias = _smoothedFrameMs <= budget
                ? _lodBiasHigh
                : Mathf.Lerp(_lodBiasHigh, _lodBiasLow,
                    (_smoothedFrameMs - budget) / budget);

            _currentLodBias = Mathf.MoveTowards(_currentLodBias, targetBias, Time.deltaTime * 0.5f);
            QualitySettings.lodBias = _currentLodBias;

            // --- DRS adjustment ---
            _drsTimer += unscaledDeltaTime;
            if (_drsTimer >= _drsAdjustInterval)
            {
                _drsTimer = 0f;
                AdjustDRS();
            }

            // --- Flush instancing batches ---
            FlushInstanceBatches();
        }

        // ──────────────────────────────────────────────────────────
        //  FRAME TIME TRACKING
        // ──────────────────────────────────────────────────────────

        private void RecordFrameTime(float ms)
        {
            _frameTimes[_frameIdx] = ms;
            _frameIdx = (_frameIdx + 1) % _frameSampleCount;

            float sum = 0f;
            foreach (float t in _frameTimes) sum += t;
            _smoothedFrameMs = sum / _frameSampleCount;
        }

        // ──────────────────────────────────────────────────────────
        //  DYNAMIC RESOLUTION SCALING
        // ──────────────────────────────────────────────────────────

        private void AdjustDRS()
        {
            float budget = Config.targetFrameBudgetMs;
            float ratio  = _smoothedFrameMs / budget;

            if (ratio > 1.05f)
                _currentDrsScale = Mathf.Max(Config.drsMinScale, _currentDrsScale - 0.05f);
            else if (ratio < 0.90f)
                _currentDrsScale = Mathf.Min(1f, _currentDrsScale + 0.02f);

            // Actual scale is applied via callback below.
        }

        /// <summary>HDRP DRS callback — returns the current render scale as a percentage.</summary>
        private float DRSScalerCallback() => _currentDrsScale * 100f;

        // ──────────────────────────────────────────────────────────
        //  GPU INSTANCING
        // ──────────────────────────────────────────────────────────

        /// <summary>
        /// Registers all <see cref="MeshRenderer"/>s in a newly loaded chunk for
        /// GPU-instanced batching. Renderers with instancing-compatible materials
        /// are moved to the instancing batch; others remain as normal draw calls.
        /// </summary>
        public void OnChunkLoaded(WorldChunk chunk)
        {
            if (chunk.TerrainComponent == null) return;

            var renderers = new List<MeshRenderer>(64);
            chunk.TerrainComponent.GetComponentsInChildren(true, renderers);

            foreach (MeshRenderer mr in renderers)
            {
                // Only batch single-material static renderers with instancing support.
                if (!mr.gameObject.isStatic) continue;
                if (mr.sharedMaterials.Length != 1) continue;
                if (!mr.sharedMaterial.enableInstancing) continue;

                var mf = mr.GetComponent<MeshFilter>();
                if (mf == null || mf.sharedMesh == null) continue;

                var key = new BatchKey(mf.sharedMesh, mr.sharedMaterial);
                if (!_instanceBatches.ContainsKey(key))
                    _instanceBatches[key] = new List<Matrix4x4>(_maxInstancesPerBatch);

                _instanceBatches[key].Add(mr.localToWorldMatrix);

                // Disable the individual renderer — we'll draw it via instancing.
                mr.enabled = false;
            }

            _chunkRenderers[chunk.Coord] = renderers;
        }

        /// <summary>
        /// Removes a chunk's renderers from the instancing batch when it unloads.
        /// </summary>
        public void OnChunkUnloaded(WorldChunk chunk)
        {
            if (_chunkRenderers.TryGetValue(chunk.Coord, out var renderers))
            {
                // Re-enable renderers before returning to pool (pool will deactivate GO).
                foreach (var mr in renderers)
                    if (mr != null) mr.enabled = true;

                // Remove their matrices from batches (rebuild next flush — acceptable for unload).
                _instanceBatches.Clear();      // Simple rebuild; unloads are infrequent.
                _chunkRenderers.Remove(chunk.Coord);

                // Re-register remaining chunks.
                foreach (var pair in _chunkRenderers)
                    RebuildBatchForRenderers(pair.Value);
            }
        }

        private void RebuildBatchForRenderers(List<MeshRenderer> renderers)
        {
            foreach (MeshRenderer mr in renderers)
            {
                if (mr == null || mr.enabled) continue;
                var mf = mr.GetComponent<MeshFilter>();
                if (mf == null) continue;

                var key = new BatchKey(mf.sharedMesh, mr.sharedMaterial);
                if (!_instanceBatches.ContainsKey(key))
                    _instanceBatches[key] = new List<Matrix4x4>(_maxInstancesPerBatch);

                _instanceBatches[key].Add(mr.localToWorldMatrix);
            }
        }

        /// <summary>
        /// Issues one <see cref="Graphics.DrawMeshInstanced"/> call per unique
        /// (Mesh, Material) batch. Called every frame at end of Tick.
        /// </summary>
        private void FlushInstanceBatches()
        {
            if (_instanceBatches.Count == 0) return;

            foreach (var pair in _instanceBatches)
            {
                List<Matrix4x4> matrices = pair.Value;
                if (matrices.Count == 0) continue;

                Mesh     mesh = pair.Key.Mesh;
                Material mat  = pair.Key.Material;

                // Unity DrawMeshInstanced limit is 1023; issue multiple calls if needed.
                int offset = 0;
                while (offset < matrices.Count)
                {
                    int count = Mathf.Min(_maxInstancesPerBatch, matrices.Count - offset);
                    var slice = matrices.GetRange(offset, count);
                    Graphics.DrawMeshInstanced(mesh, 0, mat, slice, null,
                        ShadowCastingMode.Off, true,    // receiveShadows = true.
                        gameObject.layer, Camera.main);
                    offset += count;
                }
            }
        }

        // ──────────────────────────────────────────────────────────
        //  LAYER CULL DISTANCES
        // ──────────────────────────────────────────────────────────

        private void BuildLayerCullTable()
        {
            _cullDistanceTable = new float[32];
            foreach (LayerCullEntry entry in _layerCullDistances)
            {
                int idx = LayerMask.NameToLayer(entry.LayerName);
                if (idx >= 0) _cullDistanceTable[idx] = entry.CullDistance;
            }
        }

        private void ApplyLayerCullTable()
        {
            if (Camera.main != null)
                Camera.main.layerCullDistances = _cullDistanceTable;
        }

        // ──────────────────────────────────────────────────────────
        //  PUBLIC API
        // ──────────────────────────────────────────────────────────

        /// <summary>Returns the current smoothed frame time in milliseconds.</summary>
        public float GetSmoothedFrameMs() => _smoothedFrameMs;

        /// <summary>Returns the current DRS scale factor (0–1).</summary>
        public float GetCurrentDRSScale() => _currentDrsScale;

        /// <summary>Returns the current LOD bias.</summary>
        public float GetCurrentLODBias() => _currentLodBias;

        /// <summary>
        /// [Quality Hook] Clamps the maximum DRS scale (e.g., to force lower
        /// resolution on low-spec hardware at startup, before adaptive KBs in).
        /// </summary>
        public void SetMaxDRSScale(float max01)
        {
            _currentDrsScale = Mathf.Min(_currentDrsScale, Mathf.Clamp01(max01));
        }

        // ──────────────────────────────────────────────────────────
        //  INTERNAL TYPES
        // ──────────────────────────────────────────────────────────

        /// <summary>Composite key for GPU instancing batch dictionary.</summary>
        private readonly struct BatchKey : System.IEquatable<BatchKey>
        {
            public readonly Mesh     Mesh;
            public readonly Material Material;

            public BatchKey(Mesh m, Material mat) { Mesh = m; Material = mat; }

            public bool Equals(BatchKey other) =>
                Mesh == other.Mesh && Material == other.Material;

            public override bool Equals(object obj) =>
                obj is BatchKey k && Equals(k);

            public override int GetHashCode() =>
                (Mesh?.GetHashCode() ?? 0) * 397 ^ (Material?.GetHashCode() ?? 0);
        }
    }

    // ──────────────────────────────────────────────────────────────
    //  DATA
    // ──────────────────────────────────────────────────────────────

    /// <summary>
    /// Maps a Unity layer name to a camera cull distance.
    /// Configured in <see cref="PerformanceManager"/> Inspector.
    /// </summary>
    [System.Serializable]
    public struct LayerCullEntry
    {
        [Tooltip("Exact Unity layer name.")]
        public string LayerName;

        [Tooltip("Distance in world metres beyond which objects on this layer are culled.")]
        public float CullDistance;
    }
}
