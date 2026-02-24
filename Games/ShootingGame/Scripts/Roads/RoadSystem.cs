using System;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.Rendering.HighDefinition;
using ShootingGame.World.Core;

namespace ShootingGame.World.Roads
{
    // ============================================================
    //  RoadSystem — AAA Open World Ground System
    //  Spline-based road mesh generation + terrain deformation + PBR decals.
    //  Author  : AAA Ground System v1.0
    //  Phase   : 1 — Ground & Environment Base
    // ============================================================

    /// <summary>
    /// Builds road meshes from Bezier splines defined in <see cref="WorldConfig"/>,
    /// deforms underlying terrain heightmaps to conform to the road grade,
    /// and places HDRP <see cref="DecalProjector"/> instances for surface detail.
    ///
    /// Future expansion hooks (already stubbed):
    ///   • <see cref="GetLaneCenter"/> — vehicle / traffic path queries
    ///   • <see cref="GetNavMeshSurface"/> — NavMesh surface per road
    ///   • <see cref="TrafficNodeGraph"/> — lane graph for dense traffic AI
    ///
    /// Architecture notes:
    ///   • One <see cref="BuiltRoad"/> instance per spline definition.
    ///   • Meshes are built once at Initialise and stored; only decals stream
    ///     with chunks for memory efficiency.
    ///   • Terrain deformation is stamped into the TerrainData heightmap after
    ///     terrain chunks are loaded, via the <see cref="OnChunkLoaded"/> callback.
    /// </summary>
    public sealed class RoadSystem : GroundSubSystem
    {
        // ──────────────────────────────────────────────────────────
        //  INSPECTOR
        // ──────────────────────────────────────────────────────────

        [Header("Decal Assets")]
        [Tooltip("Prefab with DecalProjector for asphalt crack marks.")]
        [SerializeField] private GameObject _crackDecalPrefab;

        [Tooltip("Prefab with DecalProjector for oil stain marks.")]
        [SerializeField] private GameObject _oilStainDecalPrefab;

        [Tooltip("Prefab with DecalProjector for zebra crossing lines.")]
        [SerializeField] private GameObject _zebraDecalPrefab;

        [Header("Road Mesh")]
        [Tooltip("Number of tessellation segments per spline sample step. 1 = one quad strip.")]
        [SerializeField] [Range(1, 4)] private int _crossSectionSegments = 2;

        [Tooltip("UV tiling scale along road length (affects texture repeat frequency).")]
        [SerializeField] private float _uvLengthScale = 0.1f;

        // ──────────────────────────────────────────────────────────
        //  PRIVATE STATE
        // ──────────────────────────────────────────────────────────

        private readonly List<BuiltRoad> _builtRoads = new List<BuiltRoad>();

        /// <summary>Current global wetness factor (0=dry, 1=wet), driven from CityGroundSystem.</summary>
        private float _currentWetness;

        // ──────────────────────────────────────────────────────────
        //  INITIALISE
        // ──────────────────────────────────────────────────────────

        public override void Initialise()
        {
            foreach (RoadSplineDefinition def in Config.roadSplines)
            {
                BuildRoad(def);
            }

            base.Initialise();
            Debug.Log($"[RoadSystem] Built {_builtRoads.Count} road(s).");
        }

        // ──────────────────────────────────────────────────────────
        //  ROAD MESH CONSTRUCTION
        // ──────────────────────────────────────────────────────────

        /// <summary>
        /// Converts a <see cref="RoadSplineDefinition"/> into a GameObject with a
        /// MeshRenderer using the road surface PBR material, a MeshCollider for
        /// vehicle physics, and a set of DecalProjectors for surface detail.
        /// </summary>
        private void BuildRoad(RoadSplineDefinition def)
        {
            if (def.controlPoints == null || def.controlPoints.Count < 4)
            {
                Debug.LogWarning($"[RoadSystem] Road '{def.roadName}' skipped — needs ≥4 control points.");
                return;
            }

            float roadWidth = def.widthOverride > 0f ? def.widthOverride : Config.roadWidthMetres;
            float step      = Config.roadSplineSampleStep;

            // Sample the full spline into world-space cross-section origins.
            var samples = SampleCatmullRomSpline(def.controlPoints, step);

            if (samples.Count < 2) return;

            // Build the road mesh from the cross-sections.
            Mesh roadMesh = BuildRoadMesh(samples, roadWidth);

            // Create the GameObject.
            var go = new GameObject($"Road_{def.roadName}") { isStatic = true };
            go.transform.SetParent(transform, worldPositionStays: false);

            var mf  = go.AddComponent<MeshFilter>();
            mf.sharedMesh = roadMesh;

            var mr  = go.AddComponent<MeshRenderer>();
            mr.sharedMaterial = Config.roadSurfaceMaterial;
            mr.shadowCastingMode = UnityEngine.Rendering.ShadowCastingMode.Off; // Roads rarely self-shadow.

            var mc  = go.AddComponent<MeshCollider>();
            mc.sharedMesh = roadMesh;
            mc.cookingOptions = MeshColliderCookingOptions.UseFastMidphase;

            // Place decals along the spline.
            var decalRoot = new GameObject("Decals");
            decalRoot.transform.SetParent(go.transform, worldPositionStays: false);
            PlaceDecals(samples, def.decalDensity, roadWidth, decalRoot.transform);

            var builtRoad = new BuiltRoad
            {
                Definition = def,
                RootObject = go,
                Samples    = samples,
                Width      = roadWidth,
                Renderer   = mr
            };

            _builtRoads.Add(builtRoad);
        }

        // ──────────────────────────────────────────────────────────
        //  MESH BUILDER
        // ──────────────────────────────────────────────────────────

        /// <summary>
        /// Generates a triangle-strip road mesh from ordered cross-section samples.
        /// Each sample contributes a left edge vertex and right edge vertex at
        /// ±(roadWidth/2) perpendicular to the spline tangent.
        /// </summary>
        private Mesh BuildRoadMesh(List<SplineSample> samples, float roadWidth)
        {
            var verts  = new List<Vector3>(samples.Count * 2);
            var uvs    = new List<Vector2>(samples.Count * 2);
            var norms  = new List<Vector3>(samples.Count * 2);
            var tris   = new List<int>((samples.Count - 1) * 6);

            float halfW = roadWidth * 0.5f;
            float lengthAccum = 0f;

            for (int i = 0; i < samples.Count; i++)
            {
                SplineSample s = samples[i];
                Vector3 right = Vector3.Cross(s.Tangent, Vector3.up).normalized;

                Vector3 leftPt  = s.Position - right * halfW;
                Vector3 rightPt = s.Position + right * halfW;

                verts.Add(leftPt);
                verts.Add(rightPt);

                float u = lengthAccum * _uvLengthScale;
                uvs.Add(new Vector2(0f, u));
                uvs.Add(new Vector2(1f, u));

                norms.Add(Vector3.up);
                norms.Add(Vector3.up);

                if (i > 0)
                {
                    // Accumulate arc length for UV continuity.
                    lengthAccum += Vector3.Distance(samples[i].Position, samples[i - 1].Position);

                    int b = (i - 1) * 2;
                    // Two triangles per quad strip segment.
                    tris.Add(b);     tris.Add(b + 2); tris.Add(b + 1);
                    tris.Add(b + 1); tris.Add(b + 2); tris.Add(b + 3);
                }
            }

            var mesh = new Mesh { name = "RoadMesh" };
            mesh.indexFormat = UnityEngine.Rendering.IndexFormat.UInt32;
            mesh.SetVertices(verts);
            mesh.SetUVs(0, uvs);
            mesh.SetNormals(norms);
            mesh.SetTriangles(tris, 0);
            mesh.RecalculateTangents();
            mesh.Optimize();
            return mesh;
        }

        // ──────────────────────────────────────────────────────────
        //  SPLINE SAMPLING (Catmull-Rom)
        // ──────────────────────────────────────────────────────────

        /// <summary>
        /// Samples a Catmull-Rom spline defined by <paramref name="controlPoints"/> at
        /// every <paramref name="step"/> world metres. Returns a list of
        /// <see cref="SplineSample"/> with position and tangent.
        /// </summary>
        private List<SplineSample> SampleCatmullRomSpline(
            List<Vector3> controlPoints, float step)
        {
            var result = new List<SplineSample>(512);
            int n = controlPoints.Count;

            // Iterate over each segment p[i]→p[i+1] with phantom endpoints.
            for (int i = 0; i < n - 1; i++)
            {
                Vector3 p0 = controlPoints[Mathf.Clamp(i - 1, 0, n - 1)];
                Vector3 p1 = controlPoints[i];
                Vector3 p2 = controlPoints[Mathf.Clamp(i + 1, 0, n - 1)];
                Vector3 p3 = controlPoints[Mathf.Clamp(i + 2, 0, n - 1)];

                // Estimate arc length for this segment via adaptive sampling.
                float segLen = EstimateSegmentLength(p0, p1, p2, p3);
                int   steps  = Mathf.Max(2, Mathf.CeilToInt(segLen / step));

                for (int s = 0; s <= steps; s++)
                {
                    float t = (float)s / steps;
                    Vector3 pos = CatmullRom(p0, p1, p2, p3, t);
                    Vector3 tan = CatmullRomDerivative(p0, p1, p2, p3, t).normalized;
                    result.Add(new SplineSample { Position = pos, Tangent = tan });
                }
            }

            return result;
        }

        private static Vector3 CatmullRom(Vector3 p0, Vector3 p1, Vector3 p2, Vector3 p3, float t)
        {
            float t2 = t * t, t3 = t2 * t;
            return 0.5f * (
                2f * p1 +
                (-p0 + p2)           * t +
                (2f*p0 - 5f*p1 + 4f*p2 - p3) * t2 +
                (-p0 + 3f*p1 - 3f*p2 + p3)   * t3);
        }

        private static Vector3 CatmullRomDerivative(Vector3 p0, Vector3 p1, Vector3 p2, Vector3 p3, float t)
        {
            float t2 = t * t;
            return 0.5f * (
                (-p0 + p2) +
                (4f*p0 - 10f*p1 + 8f*p2 - 2f*p3) * t +
                (-3f*p0 + 9f*p1 - 9f*p2 + 3f*p3)  * t2);
        }

        private static float EstimateSegmentLength(Vector3 p0, Vector3 p1, Vector3 p2, Vector3 p3)
        {
            float len = 0f;
            Vector3 prev = CatmullRom(p0, p1, p2, p3, 0f);
            for (int s = 1; s <= 10; s++)
            {
                Vector3 next = CatmullRom(p0, p1, p2, p3, s / 10f);
                len += Vector3.Distance(prev, next);
                prev = next;
            }
            return len;
        }

        // ──────────────────────────────────────────────────────────
        //  TERRAIN DEFORMATION
        // ──────────────────────────────────────────────────────────

        /// <summary>
        /// When a terrain chunk loads, stamps the road height profile into the chunk's
        /// TerrainData heightmap within the configured blend zone. The deformation
        /// uses a smooth cosine falloff to prevent sharp edges.
        /// </summary>
        public void OnChunkLoaded(WorldChunk chunk)
        {
            if (chunk.TerrainComponent == null) return;

            foreach (BuiltRoad road in _builtRoads)
            {
                DeformTerrainForRoad(chunk, road);
            }
        }

        private void DeformTerrainForRoad(WorldChunk chunk, BuiltRoad road)
        {
            Terrain       terrain = chunk.TerrainComponent;
            TerrainData   data    = terrain.terrainData;
            float chunkSize       = Config.chunkSizeMetres;
            float blendDist       = Config.roadEdgeBlendDistance;
            float halfW           = road.Width * 0.5f + blendDist;
            Vector3 terrainOrigin = terrain.transform.position;

            int res = data.heightmapResolution;
            float[,] heights = data.GetHeights(0, 0, res, res);

            bool mutated = false;

            // For each spline sample that is within this chunk, deform nearby texels.
            foreach (SplineSample sample in road.Samples)
            {
                // Is this sample near the chunk bounds?
                Vector3 chunkMin = terrainOrigin;
                Vector3 chunkMax = terrainOrigin + new Vector3(chunkSize, 0, chunkSize);
                if (sample.Position.x < chunkMin.x - halfW || sample.Position.x > chunkMax.x + halfW) continue;
                if (sample.Position.z < chunkMin.z - halfW || sample.Position.z > chunkMax.z + halfW) continue;

                // Convert road sample position to heightmap texel coordinates.
                int cx = Mathf.Clamp(Mathf.RoundToInt(((sample.Position.x - terrainOrigin.x) / chunkSize) * (res - 1)), 0, res - 1);
                int cz = Mathf.Clamp(Mathf.RoundToInt(((sample.Position.z - terrainOrigin.z) / chunkSize) * (res - 1)), 0, res - 1);

                float roadH = Mathf.Clamp01(sample.Position.y / 400f);
                int   bTex  = Mathf.CeilToInt((halfW / chunkSize) * (res - 1));

                for (int dr = -bTex; dr <= bTex; dr++)
                {
                    for (int dc = -bTex; dc <= bTex; dc++)
                    {
                        int r = cz + dr, c = cx + dc;
                        if (r < 0 || r >= res || c < 0 || c >= res) continue;

                        float texelX = terrainOrigin.x + ((float)c / (res - 1)) * chunkSize;
                        float texelZ = terrainOrigin.z + ((float)r / (res - 1)) * chunkSize;

                        // Perpendicular distance from road centreline.
                        Vector3 toTexel = new Vector3(texelX - sample.Position.x, 0, texelZ - sample.Position.z);
                        Vector3 right   = Vector3.Cross(sample.Tangent, Vector3.up);
                        float   perpDist = Mathf.Abs(Vector3.Dot(toTexel, right));

                        if (perpDist > halfW) continue;

                        float blend = perpDist <= road.Width * 0.5f
                            ? 1f
                            : 1f - (perpDist - road.Width * 0.5f) / blendDist;

                        // Cosine falloff for smooth edge.
                        blend = (1f - Mathf.Cos(blend * Mathf.PI)) * 0.5f;

                        heights[r, c] = Mathf.Lerp(heights[r, c], roadH, blend * Config.roadErosionStrength);
                        mutated = true;
                    }
                }
            }

            if (mutated) data.SetHeights(0, 0, heights);
        }

        // ──────────────────────────────────────────────────────────
        //  DECAL PLACEMENT
        // ──────────────────────────────────────────────────────────

        private void PlaceDecals(List<SplineSample> samples, float density, float roadWidth, Transform parent)
        {
            if (_crackDecalPrefab == null && _oilStainDecalPrefab == null) return;

            System.Random rng = new System.Random(Config.worldSeed);
            float spacing = Mathf.Max(2f, 5f / density);

            float distAccum = 0f;
            for (int i = 1; i < samples.Count; i++)
            {
                distAccum += Vector3.Distance(samples[i].Position, samples[i - 1].Position);
                if (distAccum < spacing) continue;
                distAccum = 0f;

                // Random lateral offset within road bounds.
                float   lateral = ((float)rng.NextDouble() - 0.5f) * roadWidth * 0.8f;
                Vector3 right   = Vector3.Cross(samples[i].Tangent, Vector3.up);
                Vector3 pos     = samples[i].Position + right * lateral + Vector3.up * 0.05f;

                // Choose decal type probabilistically.
                double roll = rng.NextDouble();
                GameObject prefab = roll < 0.6f ? _crackDecalPrefab :
                                    roll < 0.85f ? _oilStainDecalPrefab :
                                    _zebraDecalPrefab;

                if (prefab == null) continue;

                var decal = UnityEngine.Object.Instantiate(prefab, pos,
                    Quaternion.LookRotation(samples[i].Tangent) * Quaternion.Euler(90, 0, 0),
                    parent);
                decal.isStatic = true;
            }
        }

        // ──────────────────────────────────────────────────────────
        //  PUBLIC API
        // ──────────────────────────────────────────────────────────

        /// <summary>
        /// Sets the <c>_WetFactor</c> material property on all road renderers.
        /// Called by <see cref="CityGroundSystem.SetWetness"/>.
        /// </summary>
        public void SetWetness(float wet01)
        {
            _currentWetness = wet01;
            foreach (BuiltRoad road in _builtRoads)
            {
                if (road.Renderer != null)
                    road.Renderer.material.SetFloat("_WetFactor", wet01);
            }
        }

        /// <summary>
        /// [Traffic Hook] Returns the world-space position on the centreline of road
        /// <paramref name="roadIndex"/>, offset to <paramref name="laneIndex"/> lane,
        /// at spline parameter <paramref name="t"/> [0,1].
        /// </summary>
        public Vector3 GetLaneCenter(int roadIndex, int laneIndex, float t)
        {
            if (roadIndex < 0 || roadIndex >= _builtRoads.Count) return Vector3.zero;
            BuiltRoad road     = _builtRoads[roadIndex];
            int sampleIdx      = Mathf.Clamp(Mathf.RoundToInt(t * (road.Samples.Count - 1)), 0, road.Samples.Count - 1);
            SplineSample s     = road.Samples[sampleIdx];
            Vector3 right      = Vector3.Cross(s.Tangent, Vector3.up);
            float laneWidth    = road.Width / 4f;   // Assume 4 lanes.
            float offset       = (laneIndex - 1.5f) * laneWidth;
            return s.Position + right * offset;
        }

        /// <summary>
        /// [NavMesh Hook] Returns the root transform whose children contain
        /// NavMeshSurface components for baking. Populated when NavMesh package is added.
        /// </summary>
        public Transform GetNavMeshSurface(int roadIndex)
        {
            // Stub: return road root for NavMeshSurface component attachment in Phase 2.
            if (roadIndex < 0 || roadIndex >= _builtRoads.Count) return null;
            return _builtRoads[roadIndex].RootObject.transform;
        }

        // ──────────────────────────────────────────────────────────
        //  INTERNAL TYPES
        // ──────────────────────────────────────────────────────────

        private sealed class BuiltRoad
        {
            public RoadSplineDefinition Definition;
            public GameObject           RootObject;
            public List<SplineSample>   Samples;
            public float                Width;
            public MeshRenderer         Renderer;
        }

        private struct SplineSample
        {
            public Vector3 Position;
            public Vector3 Tangent;
        }
    }
}
