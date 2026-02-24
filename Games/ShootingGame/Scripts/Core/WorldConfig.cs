using System;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.Rendering.HighDefinition;

namespace ShootingGame.World.Core
{
    // ============================================================
    //  WorldConfig — AAA Open World Ground System
    //  ScriptableObject: single source of truth for all world params.
    //  Author  : AAA Ground System v1.0
    //  Phase   : 1 — Ground & Environment Base
    // ============================================================

    /// <summary>
    /// Authoritative configuration asset for the Open World Ground System.
    /// Assign one instance to CityGroundSystem via the Inspector.
    /// All sub-systems pull their parameters from here so tuning one
    /// asset updates the entire world without touching code.
    /// </summary>
    [CreateAssetMenu(menuName = "ShootingGame/World Config", fileName = "WorldConfig")]
    public sealed class WorldConfig : ScriptableObject
    {
        // ──────────────────────────────────────────────────────────
        //  WORLD SCALE
        // ──────────────────────────────────────────────────────────

        [Header("World Scale")]
        [Tooltip("Half-size of the playable world in metres (radius from origin).")]
        public float worldRadiusMetres = 10000f;          // 10–20 km diameter

        [Tooltip("Size of each streaming terrain chunk in world metres.")]
        public float chunkSizeMetres = 500f;

        [Tooltip("Heightmap resolution per chunk (must be 2^n + 1, e.g. 513).")]
        public int chunkHeightmapResolution = 513;

        [Tooltip("Alphamap resolution per chunk for material blending.")]
        public int chunkAlphamapResolution = 512;

        [Tooltip("Detail resolution per patch used for grass / ground detail.")]
        public int chunkDetailResolution = 512;

        /// <summary>Number of chunks visible in each direction from the player (radius).</summary>
        [Tooltip("Streaming radius in chunks. 1 = 3×3 grid (9 chunks).")]
        [Range(1, 4)]
        public int streamingRadiusChunks = 1;

        // ──────────────────────────────────────────────────────────
        //  NOISE STACK
        // ──────────────────────────────────────────────────────────

        [Header("Noise Layer Stack")]
        [Tooltip("Master seed driving all procedural layers.")]
        public int worldSeed = 42;

        [Tooltip("Continental layer — low frequency, high amplitude (mountain ranges).")]
        public NoiseLayerParams continentalLayer = new NoiseLayerParams
        {
            frequency = 0.00005f, amplitude = 200f, octaves = 4, persistence = 0.5f, lacunarity = 2f
        };

        [Tooltip("Regional layer — mid frequency (hills and valleys).")]
        public NoiseLayerParams regionalLayer = new NoiseLayerParams
        {
            frequency = 0.0003f, amplitude = 60f, octaves = 3, persistence = 0.55f, lacunarity = 2.1f
        };

        [Tooltip("Local detail layer — high frequency (rocks, bumps).")]
        public NoiseLayerParams localDetailLayer = new NoiseLayerParams
        {
            frequency = 0.002f, amplitude = 8f, octaves = 2, persistence = 0.4f, lacunarity = 2.5f
        };

        [Tooltip("Erosion strength near road splines (0 = no erosion, 1 = fully flat).")]
        [Range(0f, 1f)]
        public float roadErosionStrength = 0.85f;

        [Tooltip("Distance in metres from road edge over which erosion blend is applied.")]
        public float roadErosionBlendDistance = 5f;

        // ──────────────────────────────────────────────────────────
        //  TERRAIN MATERIALS (HDRP Terrain Layers)
        // ──────────────────────────────────────────────────────────

        [Header("Terrain Layer Assets")]
        [Tooltip("Terrain layer 0 — Grass PBR.")]
        public TerrainLayer grassLayer;

        [Tooltip("Terrain layer 1 — Dirt PBR.")]
        public TerrainLayer dirtLayer;

        [Tooltip("Terrain layer 2 — Mud PBR.")]
        public TerrainLayer mudLayer;

        [Tooltip("Terrain layer 3 — Rock/Asphalt edge PBR.")]
        public TerrainLayer rockLayer;

        // ──────────────────────────────────────────────────────────
        //  LOD DISTANCES
        // ──────────────────────────────────────────────────────────

        [Header("LOD Distances")]
        [Tooltip("Distance at which terrain switches from LOD0 (full res) to LOD1.")]
        public float terrainLOD0Distance = 150f;
        [Tooltip("Distance for LOD1 → LOD2 switch.")]
        public float terrainLOD1Distance = 400f;
        [Tooltip("Distance for LOD2 → LOD3 (lowest / impostor).")]
        public float terrainLOD2Distance = 800f;

        // ──────────────────────────────────────────────────────────
        //  ROADS
        // ──────────────────────────────────────────────────────────

        [Header("Road System")]
        [Tooltip("Full road surface width in metres (e.g. 4-lane = 14 m).")]
        public float roadWidthMetres = 14f;

        [Tooltip("Sample step along the spline in metres — smaller = smoother mesh.")]
        public float roadSplineSampleStep = 1f;

        [Tooltip("Road surface PBR material (RoadSurface.shader).")]
        public Material roadSurfaceMaterial;

        [Tooltip("Road-to-terrain blend width on each edge in metres.")]
        public float roadEdgeBlendWidth = 3.5f;

        [Tooltip("List of road spline definitions loaded at startup.")]
        public List<RoadSplineDefinition> roadSplines = new List<RoadSplineDefinition>();

        // ──────────────────────────────────────────────────────────
        //  GROUND ANIMATION
        // ──────────────────────────────────────────────────────────

        [Header("Ground Animation")]
        [Tooltip("Default wind direction (XZ plane).")]
        public Vector2 windDirection = new Vector2(1f, 0.3f);

        [Tooltip("Wind speed multiplier.")]
        [Range(0f, 5f)]
        public float windSpeed = 1.2f;

        [Tooltip("Wetness level 0=dry, 1=soaked. Driven at runtime by weather hook.")]
        [Range(0f, 1f)]
        public float defaultWetness = 0f;

        [Tooltip("Seconds to interpolate from dry to fully wet.")]
        public float wetnessFadeDuration = 8f;

        // ──────────────────────────────────────────────────────────
        //  LIGHTING
        // ──────────────────────────────────────────────────────────

        [Header("Environment Lighting")]
        [Tooltip("Default sun colour temperature in Kelvin.")]
        [Range(1500f, 20000f)]
        public float sunColorTemperature = 5500f;

        [Tooltip("Sun intensity in Lux.")]
        public float sunIntensityLux = 100000f;

        [Tooltip("Volumetric fog mean free path (lower = denser fog).")]
        public float fogMeanFreePath = 500f;

        [Tooltip("Reflection probe refresh distance spacing in metres.")]
        public float reflectionProbeGridSpacing = 100f;

        // ──────────────────────────────────────────────────────────
        //  PERFORMANCE
        // ──────────────────────────────────────────────────────────

        [Header("Performance Budget")]
        [Tooltip("Target frame budget in milliseconds.")]
        public float targetFrameBudgetMs = 8.33f;   // 120 FPS target

        [Tooltip("Dynamic Resolution minimum scale (0–1). 0.67 = 67% of native res.")]
        [Range(0.5f, 1f)]
        public float drsMinScale = 0.67f;

        [Tooltip("Texture streaming mipmap budget in megabytes.")]
        public int textureMipmapBudgetMB = 512;

        [Tooltip("Maximum simultaneous async chunk load jobs.")]
        [Range(1, 8)]
        public int maxConcurrentChunkLoads = 4;
    }

    // ──────────────────────────────────────────────────────────────
    //  DATA STRUCTS (nested types used across all systems)
    // ──────────────────────────────────────────────────────────────

    /// <summary>
    /// Parameters for a single fractal Brownian motion (fBm) noise layer.
    /// </summary>
    [Serializable]
    public struct NoiseLayerParams
    {
        [Tooltip("Base spatial frequency. Higher = more frequent features.")]
        public float frequency;

        [Tooltip("Peak height contribution of this layer in world metres.")]
        public float amplitude;

        [Tooltip("Number of fBm octaves to stack.")]
        [Range(1, 8)]
        public int octaves;

        [Tooltip("Amplitude multiplier per octave (0–1, typically 0.5).")]
        [Range(0f, 1f)]
        public float persistence;

        [Tooltip("Frequency multiplier per octave (typically ~2.0).")]
        public float lacunarity;
    }

    /// <summary>
    /// World-space Bezier road spline definition stored in WorldConfig.
    /// </summary>
    [Serializable]
    public sealed class RoadSplineDefinition
    {
        [Tooltip("Human-readable label for this road (e.g. 'Main Boulevard').")]
        public string roadName = "Road";

        [Tooltip("Ordered list of Bezier control points in world space.")]
        public List<Vector3> controlPoints = new List<Vector3>();

        [Tooltip("Override road width for this specific spline (0 = use WorldConfig default).")]
        public float widthOverride = 0f;

        [Tooltip("Whether to generate NavMesh surface on this road (for future traffic).")]
        public bool generateNavMesh = true;

        [Tooltip("Decal density multiplier (oil stains, cracks). 1 = default.")]
        [Range(0f, 3f)]
        public float decalDensity = 1f;
    }

    /// <summary>
    /// Runtime state of a single world chunk managed by CityGroundSystem.
    /// This struct is value-typed to reduce GC pressure.
    /// </summary>
    public sealed class WorldChunk
    {
        /// <summary>2D grid coordinate of this chunk.</summary>
        public Vector2Int Coord { get; }

        /// <summary>World-space bounds of this chunk.</summary>
        public Bounds Bounds { get; }

        /// <summary>The Unity Terrain component for this chunk, if loaded.</summary>
        public Terrain TerrainComponent { get; set; }

        /// <summary>Current load state.</summary>
        public ChunkLoadState LoadState { get; set; } = ChunkLoadState.Unloaded;

        /// <summary>The last frame this chunk was marked as needed.</summary>
        public int LastRequiredFrame { get; set; }

        public WorldChunk(Vector2Int coord, Bounds bounds)
        {
            Coord = coord;
            Bounds = bounds;
        }
    }

    /// <summary>Load state machine for WorldChunk.</summary>
    public enum ChunkLoadState
    {
        Unloaded,
        Loading,
        Loaded,
        Unloading
    }
}
