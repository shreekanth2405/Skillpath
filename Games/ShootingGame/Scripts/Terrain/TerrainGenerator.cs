using System;
using System.Collections;
using System.Collections.Generic;
using Unity.Collections;
using Unity.Jobs;
using UnityEngine;
using ShootingGame.World.Core;

namespace ShootingGame.World.Terrain
{
    // ============================================================
    //  TerrainGenerator — AAA Open World Ground System
    //  Procedural terrain with chunk streaming, noise stack, LOD.
    //  Author  : AAA Ground System v1.0
    //  Phase   : 1 — Ground & Environment Base
    // ============================================================

    /// <summary>
    /// Generates, streams, and manages Unity Terrain chunks for the open world.
    ///
    /// Key design decisions:
    ///   • Each chunk uses Unity's built-in <see cref="Terrain"/> / <see cref="TerrainData"/>
    ///     objects because they integrate natively with HDRP terrain shaders and LOD.
    ///   • Height generation is dispatched to a Unity Job (<see cref="HeightmapGenerationJob"/>)
    ///     so it runs on worker threads and does not stall the main thread.
    ///   • Edge stitching uses a shared 1-texel border copied from neighbouring loaded
    ///     chunks, making seams invisible at any LOD level.
    ///   • A <see cref="TerrainPool"/> reuses Terrain GameObjects to avoid instantiation
    ///     GC spikes during streaming.
    /// </summary>
    public sealed class TerrainGenerator : GroundSubSystem
    {
        // ──────────────────────────────────────────────────────────
        //  INSPECTOR
        // ──────────────────────────────────────────────────────────

        [Header("Terrain Pool")]
        [Tooltip("Peak number of concurrent terrain objects (pool size). " +
                 "Set to (streamingRadius*2+1)^2 + a buffer.")]
        [SerializeField] private int _poolSize = 16;

        [Header("Material Override")]
        [Tooltip("Optional: override the terrain material (must use HDRP TerrainLit or TerrainBlend shader). " +
                 "If null, TerrainGenerator assigns layers from WorldConfig.")]
        [SerializeField] private Material _terrainMaterialOverride;

        [Header("LOD Settings")]
        [Tooltip("Pixel error for Unity terrain LOD — lower = sharper, more draw calls.")]
        [SerializeField] [Range(1, 200)] private float _heightmapPixelError = 15f;
        [Tooltip("Maximum render distance for terrain detail objects (grass, etc.).")]
        [SerializeField] private float _detailDistance = 80f;
        [Tooltip("Maximum tree render distance.")]
        [SerializeField] private float _treeDistance = 2000f;

        // ──────────────────────────────────────────────────────────
        //  PRIVATE STATE
        // ──────────────────────────────────────────────────────────

        private TerrainPool _pool;

        /// <summary>Heightmaps cached per chunk coord for stitch operations.</summary>
        private readonly Dictionary<Vector2Int, float[,]> _cachedHeightmaps =
            new Dictionary<Vector2Int, float[,]>(32);

        /// <summary>In-flight job handles keyed by chunk coord.</summary>
        private readonly Dictionary<Vector2Int, HeightJobHandle> _activeJobs =
            new Dictionary<Vector2Int, HeightJobHandle>(8);

        // ──────────────────────────────────────────────────────────
        //  INITIALISE
        // ──────────────────────────────────────────────────────────

        public override void Initialise()
        {
            _pool = new TerrainPool(_poolSize, transform, Config, _terrainMaterialOverride);
            _pool.PreWarm();
            StartCoroutine(JobCompletionPoll());
            base.Initialise();
            Debug.Log("[TerrainGenerator] Initialised. Pool size: " + _poolSize);
        }

        // ──────────────────────────────────────────────────────────
        //  PUBLIC API — Chunk Load / Unload
        // ──────────────────────────────────────────────────────────

        /// <summary>
        /// Requests asynchronous generation of the terrain for <paramref name="chunk"/>.
        /// On completion, <paramref name="onComplete"/> is called on the main thread.
        /// </summary>
        public void RequestChunkLoad(WorldChunk chunk, Action<WorldChunk> onComplete)
        {
            if (_activeJobs.ContainsKey(chunk.Coord)) return;

            int   res  = Config.chunkHeightmapResolution;
            float size = Config.chunkSizeMetres;

            // Allocate native array for the Job System (disposed after job completes).
            var heightsNative = new NativeArray<float>(res * res, Allocator.Persistent);
            float worldX = chunk.Coord.x * size;
            float worldZ = chunk.Coord.y * size;

            var job = new HeightmapGenerationJob
            {
                Heights           = heightsNative,
                Resolution        = res,
                WorldOffsetX      = worldX,
                WorldOffsetZ      = worldZ,
                ChunkSize         = size,
                Seed              = Config.worldSeed,
                Continental       = Config.continentalLayer,
                Regional          = Config.regionalLayer,
                LocalDetail       = Config.localDetailLayer,
            };

            JobHandle handle = job.Schedule(res * res, 64);

            _activeJobs[chunk.Coord] = new HeightJobHandle
            {
                Handle          = handle,
                NativeHeights   = heightsNative,
                Chunk           = chunk,
                Resolution      = res,
                OnComplete      = onComplete
            };
        }

        /// <summary>
        /// Releases the terrain for <paramref name="chunk"/> back to the pool.
        /// Heightmap cache is retained for fast re-load if player returns.
        /// </summary>
        public void RequestChunkUnload(WorldChunk chunk, Action<WorldChunk> onComplete)
        {
            if (chunk.TerrainComponent != null)
            {
                _pool.Return(chunk.TerrainComponent);
                chunk.TerrainComponent = null;
            }
            onComplete?.Invoke(chunk);
        }

        // ──────────────────────────────────────────────────────────
        //  JOB COMPLETION POLLING
        // ──────────────────────────────────────────────────────────

        /// <summary>
        /// Polls active job handles each frame. When a job completes,
        /// applies the heightmap to a terrain from the pool on the main thread.
        /// </summary>
        private IEnumerator JobCompletionPoll()
        {
            var completed = new List<Vector2Int>(4);

            while (true)
            {
                completed.Clear();

                foreach (var pair in _activeJobs)
                {
                    if (pair.Value.Handle.IsCompleted)
                        completed.Add(pair.Key);
                }

                foreach (Vector2Int coord in completed)
                {
                    HeightJobHandle hjh = _activeJobs[coord];
                    hjh.Handle.Complete();    // Safe — job is done.

                    ApplyHeightmapToTerrain(hjh);

                    hjh.NativeHeights.Dispose();
                    _activeJobs.Remove(coord);
                }

                yield return null;    // Resume next frame.
            }
        }

        // ──────────────────────────────────────────────────────────
        //  HEIGHTMAP APPLICATION + STITCHING
        // ──────────────────────────────────────────────────────────

        /// <summary>
        /// Takes the completed native height data, converts it to a managed float[,]
        /// array, applies edge stitching from neighbours, then assigns it to a pooled
        /// Terrain object.
        /// </summary>
        private void ApplyHeightmapToTerrain(HeightJobHandle hjh)
        {
            int res = hjh.Resolution;
            float size = Config.chunkSizeMetres;

            // Convert flat native array → Unity's [row, col] format.
            var heights = new float[res, res];
            for (int i = 0; i < hjh.NativeHeights.Length; i++)
            {
                int row = i / res;
                int col = i % res;
                heights[row, col] = hjh.NativeHeights[i];
            }

            // Stitch edges from loaded neighbours to prevent seams.
            StitchEdges(hjh.Chunk.Coord, heights, res);

            // Cache for future stitch operations when adjacent chunks load.
            _cachedHeightmaps[hjh.Chunk.Coord] = heights;

            // Acquire terrain from pool and configure it.
            Terrain terrain = _pool.Acquire(hjh.Chunk.Coord);
            TerrainData data = terrain.terrainData;

            data.heightmapResolution = res;
            data.size = new Vector3(size, 400f, size);
            data.SetHeights(0, 0, heights);

            // HDRP Terrain Layers (splat map).
            AssignTerrainLayers(data, heights, res);

            // Position the terrain in world space.
            terrain.transform.position = new Vector3(
                hjh.Chunk.Coord.x * size, 0f, hjh.Chunk.Coord.y * size);

            // LOD quality settings.
            terrain.heightmapPixelError    = _heightmapPixelError;
            terrain.detailObjectDistance   = _detailDistance;
            terrain.treeDistance           = _treeDistance;
            terrain.gameObject.SetActive(true);

            hjh.Chunk.TerrainComponent = terrain;
            hjh.OnComplete?.Invoke(hjh.Chunk);
        }

        /// <summary>
        /// Blends the 1-texel border rows/columns from already-loaded neighbours
        /// to guarantee zero-seam continuity across chunk boundaries.
        /// </summary>
        private void StitchEdges(Vector2Int coord, float[,] heights, int res)
        {
            int last = res - 1;

            // Helper: blend a sample from a neighbour if available.
            void BlendBorder(Vector2Int neighbourCoord, int myRow, int myCol, int nRow, int nCol)
            {
                if (_cachedHeightmaps.TryGetValue(neighbourCoord, out var nMap))
                    heights[myRow, myCol] = Mathf.Lerp(
                        heights[myRow, myCol], nMap[nRow, nCol], 0.5f);
            }

            // Left neighbour (−X)
            for (int r = 0; r < res; r++)
                BlendBorder(coord + Vector2Int.left, r, 0, r, last);

            // Right neighbour (+X)
            for (int r = 0; r < res; r++)
                BlendBorder(coord + Vector2Int.right, r, last, r, 0);

            // Bottom neighbour (−Z)
            for (int c = 0; c < res; c++)
                BlendBorder(coord + Vector2Int.down, 0, c, last, c);

            // Top neighbour (+Z)
            for (int c = 0; c < res; c++)
                BlendBorder(coord + Vector2Int.up, last, c, 0, c);
        }

        /// <summary>
        /// Generates a slope/height-based splatmap and assigns HDRP terrain layers.
        /// Layer 0 = Grass (flat low areas), Layer 1 = Dirt (mid slope),
        /// Layer 2 = Mud (low wet areas), Layer 3 = Rock (steep slopes).
        /// </summary>
        private void AssignTerrainLayers(TerrainData data, float[,] heights, int res)
        {
            // Assign layer assets from WorldConfig.
            var layers = new List<TerrainLayer>();
            if (Config.grassLayer != null) layers.Add(Config.grassLayer);
            if (Config.dirtLayer  != null) layers.Add(Config.dirtLayer);
            if (Config.mudLayer   != null) layers.Add(Config.mudLayer);
            if (Config.rockLayer  != null) layers.Add(Config.rockLayer);

            if (layers.Count == 0) return;
            data.terrainLayers = layers.ToArray();

            int aRes      = Config.chunkAlphamapResolution;
            int layerCount = layers.Count;
            float[,,] alpha = new float[aRes, aRes, layerCount];

            for (int y = 0; y < aRes; y++)
            {
                for (int x = 0; x < aRes; x++)
                {
                    // Sample height and slope at this alphamap texel.
                    float normX   = (float)x / aRes;
                    float normY   = (float)y / aRes;
                    float h       = heights[
                        Mathf.Clamp(Mathf.RoundToInt(normY * (res - 1)), 0, res - 1),
                        Mathf.Clamp(Mathf.RoundToInt(normX * (res - 1)), 0, res - 1)];
                    float slope   = data.GetSteepness(normX, normY) / 90f;   // 0–1

                    // Simple bilinear blending rules.
                    float grassW = Mathf.Clamp01(1f - slope * 3f) * (1f - h * 0.5f);
                    float dirtW  = Mathf.Clamp01(slope * 2f) * (1f - slope);
                    float mudW   = Mathf.Clamp01(h < 0.1f ? 0.5f : 0f);
                    float rockW  = Mathf.Clamp01(slope - 0.5f);

                    float total = grassW + dirtW + mudW + rockW + 1e-6f;

                    if (layerCount > 0) alpha[y, x, 0] = grassW / total;
                    if (layerCount > 1) alpha[y, x, 1] = dirtW  / total;
                    if (layerCount > 2) alpha[y, x, 2] = mudW   / total;
                    if (layerCount > 3) alpha[y, x, 3] = rockW  / total;
                }
            }

            data.SetAlphamaps(0, 0, alpha);
        }
    }

    // ──────────────────────────────────────────────────────────────
    //  UNITY JOB — Heightmap generation (Burst-compatible struct)
    // ──────────────────────────────────────────────────────────────

    /// <summary>
    /// Parallel jobs that compute terrain heights using layered fBm noise.
    /// Designed to be Burst-compiled (add [BurstCompile] attribute in production).
    /// Each element in the flat output array corresponds to heights[row, col]
    /// where row = index / resolution, col = index % resolution.
    /// </summary>
    [Unity.Burst.BurstCompile]
    public struct HeightmapGenerationJob : IJobParallelFor
    {
        [WriteOnly] public NativeArray<float> Heights;

        public int   Resolution;
        public float WorldOffsetX;
        public float WorldOffsetZ;
        public float ChunkSize;
        public int   Seed;

        public NoiseLayerParams Continental;
        public NoiseLayerParams Regional;
        public NoiseLayerParams LocalDetail;

        public void Execute(int index)
        {
            int row = index / Resolution;
            int col = index % Resolution;

            float wx = WorldOffsetX + ((float)col / (Resolution - 1)) * ChunkSize;
            float wz = WorldOffsetZ + ((float)row / (Resolution - 1)) * ChunkSize;

            float h = 0f;
            h += FBm(wx, wz, Continental,  Seed);
            h += FBm(wx, wz, Regional,     Seed + 1000);
            h += FBm(wx, wz, LocalDetail,  Seed + 2000);

            // Total max amplitude = continental.amplitude (200) + regional (60) + local (8) = 268.
            // Normalise to Unity terrain height range [0, 400].
            Heights[index] = Mathf.Clamp01((h + 134f) / 400f);
        }

        // ── Fractal Brownian Motion (fBm) ─────────────────────────

        private static float FBm(float x, float z, NoiseLayerParams p, int seed)
        {
            float value       = 0f;
            float amplitude   = p.amplitude;
            float frequency   = p.frequency;
            float maxAmp      = 0f;
            float seedOffset  = seed * 0.1f;

            for (int o = 0; o < p.octaves; o++)
            {
                value   += Mathf.PerlinNoise(x * frequency + seedOffset, z * frequency + seedOffset) * amplitude;
                maxAmp  += amplitude;
                amplitude *= p.persistence;
                frequency *= p.lacunarity;
            }

            // Normalise so combined octaves stay in [0, p.amplitude].
            return (value / maxAmp) * p.amplitude * 2f - p.amplitude;
        }
    }

    // ──────────────────────────────────────────────────────────────
    //  TERRAIN POOL
    // ──────────────────────────────────────────────────────────────

    /// <summary>
    /// Object pool for Unity Terrain GameObjects. Pre-warms N terrains at startup
    /// so chunk streaming never triggers Instantiate calls at runtime, avoiding
    /// GC allocation spikes during traversal.
    /// </summary>
    internal sealed class TerrainPool
    {
        private readonly Queue<Terrain>  _available = new Queue<Terrain>();
        private readonly Dictionary<Vector2Int, Terrain> _inUse = new Dictionary<Vector2Int, Terrain>();
        private readonly Transform       _parent;
        private readonly WorldConfig     _config;
        private readonly Material        _materialOverride;
        private readonly int             _size;

        public TerrainPool(int size, Transform parent, WorldConfig config, Material mat)
        {
            _size             = size;
            _parent           = parent;
            _config           = config;
            _materialOverride = mat;
        }

        /// <summary>Creates all pooled terrain objects but keeps them inactive.</summary>
        public void PreWarm()
        {
            for (int i = 0; i < _size; i++)
            {
                Terrain t = CreateTerrain(i);
                t.gameObject.SetActive(false);
                _available.Enqueue(t);
            }
        }

        /// <summary>Gets an inactive terrain from the pool for the given chunk coord.</summary>
        public Terrain Acquire(Vector2Int coord)
        {
            Terrain t = _available.Count > 0 ? _available.Dequeue() : CreateTerrain(_inUse.Count);
            _inUse[coord] = t;
            return t;
        }

        /// <summary>Returns a terrain to the available queue.</summary>
        public void Return(Terrain t)
        {
            t.gameObject.SetActive(false);

            // Remove from in-use map.
            Vector2Int foundKey = default;
            bool found = false;
            foreach (var pair in _inUse)
            {
                if (pair.Value == t) { foundKey = pair.Key; found = true; break; }
            }
            if (found) _inUse.Remove(foundKey);

            _available.Enqueue(t);
        }

        private Terrain CreateTerrain(int index)
        {
            var go   = new GameObject($"Terrain_Chunk_{index}") { isStatic = true };
            go.transform.SetParent(_parent, worldPositionStays: false);

            var data              = new TerrainData();
            data.heightmapResolution = _config.chunkHeightmapResolution;
            data.size             = new Vector3(_config.chunkSizeMetres, 400f, _config.chunkSizeMetres);

            var terrain           = go.AddComponent<Terrain>();
            terrain.terrainData   = data;
            terrain.allowAutoConnect = true;

            if (_materialOverride != null)
                terrain.materialTemplate = _materialOverride;

            var collider          = go.AddComponent<TerrainCollider>();
            collider.terrainData  = data;

            return terrain;
        }
    }

    // ──────────────────────────────────────────────────────────────
    //  INTERNAL DATA
    // ──────────────────────────────────────────────────────────────

    /// <summary>Bundles all data needed to track a single in-flight heightmap Job.</summary>
    internal struct HeightJobHandle
    {
        public JobHandle              Handle;
        public NativeArray<float>     NativeHeights;
        public WorldChunk             Chunk;
        public int                    Resolution;
        public Action<WorldChunk>     OnComplete;
    }
}
