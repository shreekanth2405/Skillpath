using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using ShootingGame.World.Terrain;
using ShootingGame.World.Roads;
using ShootingGame.World.Animation;
using ShootingGame.World.Lighting;
using ShootingGame.World.Performance;

namespace ShootingGame.World.Core
{
    // ============================================================
    //  CityGroundSystem — AAA Open World Ground System
    //  Master Orchestrator MonoBehaviour.
    //  Author  : AAA Ground System v1.0
    //  Phase   : 1 — Ground & Environment Base
    // ============================================================

    /// <summary>
    /// Root-level MonoBehaviour that owns global world state and orchestrates
    /// all Phase-1 ground sub-systems. Attach to a persistent root GameObject.
    ///
    /// Architecture notes:
    ///   • All sub-systems are registered at startup via <see cref="RegisterSystem"/>.
    ///   • A single <see cref="WorldEventBus"/> decouples sub-systems; no direct
    ///     cross-references except through the bus.
    ///   • The streaming coroutine runs continuously, evaluating which chunks
    ///     need loading / unloading based on player position.
    ///   • All chunk state mutations happen on the main thread; heavy procedural
    ///     work is dispatched through <see cref="PerformanceManager"/> job queue.
    /// </summary>
    [DefaultExecutionOrder(-100)]   // Runs before all other game scripts.
    public sealed class CityGroundSystem : MonoBehaviour
    {
        // ──────────────────────────────────────────────────────────
        //  INSPECTOR FIELDS
        // ──────────────────────────────────────────────────────────

        [Header("World Configuration")]
        [Tooltip("Assign the WorldConfig ScriptableObject asset here.")]
        [SerializeField] private WorldConfig _config;

        [Header("Player Reference")]
        [Tooltip("Transform used as the streaming anchor (player camera root).")]
        [SerializeField] private Transform _playerTransform;

        [Header("Sub-System Components")]
        [SerializeField] private TerrainGenerator    _terrainGenerator;
        [SerializeField] private RoadSystem          _roadSystem;
        [SerializeField] private GroundAnimationController _groundAnimation;
        [SerializeField] private EnvironmentLighting _environmentLighting;
        [SerializeField] private PerformanceManager  _performanceManager;

        [Header("Streaming")]
        [Tooltip("How often (seconds) the streaming loop evaluates chunk visibility.")]
        [SerializeField] [Range(0.1f, 2f)] private float _streamingTickInterval = 0.25f;

        // ──────────────────────────────────────────────────────────
        //  PRIVATE STATE
        // ──────────────────────────────────────────────────────────

        /// <summary>All chunk instances, keyed by their 2D grid coordinate.</summary>
        private readonly Dictionary<Vector2Int, WorldChunk> _chunkRegistry =
            new Dictionary<Vector2Int, WorldChunk>(256);

        /// <summary>Lightweight inter-system event bus (publish/subscribe).</summary>
        private WorldEventBus _eventBus;

        /// <summary>Whether the world has fully initialised.</summary>
        private bool _isInitialised;

        /// <summary>Current coordinate of the chunk the player occupies.</summary>
        private Vector2Int _playerChunkCoord;

        /// <summary>Reusable list to avoid per-tick allocations in streaming loop.</summary>
        private readonly List<Vector2Int> _chunksToLoad   = new List<Vector2Int>(16);
        private readonly List<Vector2Int> _chunksToUnload = new List<Vector2Int>(16);

        // ──────────────────────────────────────────────────────────
        //  PROPERTIES
        // ──────────────────────────────────────────────────────────

        /// <summary>Read-only access to the authoritative world configuration.</summary>
        public WorldConfig Config => _config;

        /// <summary>Global inter-system event bus.</summary>
        public WorldEventBus EventBus => _eventBus;

        // ──────────────────────────────────────────────────────────
        //  UNITY LIFECYCLE
        // ──────────────────────────────────────────────────────────

        private void Awake()
        {
            ValidateConfig();
            _eventBus = new WorldEventBus();
            RegisterSubSystems();
        }

        private void Start()
        {
            InitialiseSubSystems();
            _isInitialised = true;
            StartCoroutine(StreamingLoop());
            Debug.Log("[CityGroundSystem] World initialised. Streaming loop started.");
        }

        private void Update()
        {
            if (!_isInitialised) return;

            // Tick sub-systems that need per-frame updates.
            _groundAnimation.Tick(Time.time, Time.deltaTime);
            _environmentLighting.Tick(Time.time);
            _performanceManager.Tick(Time.unscaledDeltaTime);
        }

        private void OnDestroy()
        {
            StopAllCoroutines();
            _eventBus.Clear();
        }

        // ──────────────────────────────────────────────────────────
        //  INITIALISATION
        // ──────────────────────────────────────────────────────────

        /// <summary>
        /// Validates that all required references are assigned before any system starts.
        /// Throws a descriptive exception so errors surface immediately in the Editor.
        /// </summary>
        private void ValidateConfig()
        {
            if (_config           == null) throw new InvalidOperationException("[CityGroundSystem] WorldConfig asset is not assigned.");
            if (_playerTransform  == null) throw new InvalidOperationException("[CityGroundSystem] Player transform is not assigned.");
            if (_terrainGenerator == null) throw new InvalidOperationException("[CityGroundSystem] TerrainGenerator is not assigned.");
            if (_roadSystem       == null) throw new InvalidOperationException("[CityGroundSystem] RoadSystem is not assigned.");
            if (_groundAnimation  == null) throw new InvalidOperationException("[CityGroundSystem] GroundAnimationController is not assigned.");
            if (_environmentLighting == null) throw new InvalidOperationException("[CityGroundSystem] EnvironmentLighting is not assigned.");
            if (_performanceManager  == null) throw new InvalidOperationException("[CityGroundSystem] PerformanceManager is not assigned.");
        }

        /// <summary>
        /// Passes the shared config and event bus to every sub-system before
        /// any sub-system's own initialise call runs.
        /// </summary>
        private void RegisterSubSystems()
        {
            _terrainGenerator.RegisterSystem(_config, _eventBus);
            _roadSystem.RegisterSystem(_config, _eventBus);
            _groundAnimation.RegisterSystem(_config, _eventBus);
            _environmentLighting.RegisterSystem(_config, _eventBus);
            _performanceManager.RegisterSystem(_config, _eventBus);
        }

        /// <summary>
        /// Calls the ordered initialise sequence: lighting first (HDRP volume must be
        /// active before terrain materials are baked), then terrain, roads, animation,
        /// and finally performance (needs all renderers present).
        /// </summary>
        private void InitialiseSubSystems()
        {
            _environmentLighting.Initialise();
            _terrainGenerator.Initialise();
            _roadSystem.Initialise();
            _groundAnimation.Initialise();
            _performanceManager.Initialise();
        }

        // ──────────────────────────────────────────────────────────
        //  STREAMING LOOP
        // ──────────────────────────────────────────────────────────

        /// <summary>
        /// Coroutine that runs continuously, evaluating the player's position to
        /// determine which chunks need loading or unloading. Runs every
        /// <see cref="_streamingTickInterval"/> seconds to amortise cost.
        /// </summary>
        private IEnumerator StreamingLoop()
        {
            var waitInterval = new WaitForSeconds(_streamingTickInterval);

            while (true)
            {
                Vector2Int newPlayerCoord = WorldToChunkCoord(_playerTransform.position);

                if (newPlayerCoord != _playerChunkCoord || !_isInitialised)
                {
                    _playerChunkCoord = newPlayerCoord;
                    EvaluateChunkVisibility();
                    ProcessChunkQueues();
                }

                yield return waitInterval;
            }
        }

        /// <summary>
        /// Determines which chunks in the streaming radius need loading and which
        /// loaded chunks outside the radius need unloading. Results written to
        /// <see cref="_chunksToLoad"/> and <see cref="_chunksToUnload"/>.
        /// </summary>
        private void EvaluateChunkVisibility()
        {
            _chunksToLoad.Clear();
            _chunksToUnload.Clear();

            int radius = _config.streamingRadiusChunks;

            // --- Mark desired chunks (the streaming window around player) ---
            for (int dx = -radius; dx <= radius; dx++)
            {
                for (int dz = -radius; dz <= radius; dz++)
                {
                    var coord = new Vector2Int(_playerChunkCoord.x + dx, _playerChunkCoord.y + dz);

                    if (!IsCoordWithinWorldBounds(coord)) continue;

                    if (!_chunkRegistry.TryGetValue(coord, out WorldChunk chunk))
                    {
                        // Register a new chunk descriptor.
                        Bounds bounds = ChunkCoordToBounds(coord);
                        chunk = new WorldChunk(coord, bounds);
                        _chunkRegistry[coord] = chunk;
                    }

                    chunk.LastRequiredFrame = Time.frameCount;

                    if (chunk.LoadState == ChunkLoadState.Unloaded)
                        _chunksToLoad.Add(coord);
                }
            }

            // --- Find chunks that are loaded but outside the streaming radius ---
            foreach (var pair in _chunkRegistry)
            {
                WorldChunk chunk = pair.Value;
                if (chunk.LoadState == ChunkLoadState.Loaded
                    && chunk.LastRequiredFrame != Time.frameCount)
                {
                    _chunksToUnload.Add(pair.Key);
                }
            }
        }

        /// <summary>
        /// Dispatches load and unload requests to <see cref="PerformanceManager"/>
        /// respecting the max concurrent load budget defined in <see cref="WorldConfig"/>.
        /// </summary>
        private void ProcessChunkQueues()
        {
            // Sort load queue — closest chunk first for minimal pop-in.
            _chunksToLoad.Sort((a, b) =>
            {
                float da = Vector2Int.Distance(a, _playerChunkCoord);
                float db = Vector2Int.Distance(b, _playerChunkCoord);
                return da.CompareTo(db);
            });

            int loadBudget = _config.maxConcurrentChunkLoads;
            foreach (Vector2Int coord in _chunksToLoad)
            {
                if (loadBudget <= 0) break;
                if (_chunkRegistry.TryGetValue(coord, out WorldChunk chunk)
                    && chunk.LoadState == ChunkLoadState.Unloaded)
                {
                    chunk.LoadState = ChunkLoadState.Loading;
                    _terrainGenerator.RequestChunkLoad(chunk, OnChunkLoaded);
                    loadBudget--;
                }
            }

            foreach (Vector2Int coord in _chunksToUnload)
            {
                if (_chunkRegistry.TryGetValue(coord, out WorldChunk chunk)
                    && chunk.LoadState == ChunkLoadState.Loaded)
                {
                    chunk.LoadState = ChunkLoadState.Unloading;
                    _terrainGenerator.RequestChunkUnload(chunk, OnChunkUnloaded);
                }
            }
        }

        // ──────────────────────────────────────────────────────────
        //  CHUNK CALLBACKS
        // ──────────────────────────────────────────────────────────

        /// <summary>
        /// Callback from <see cref="TerrainGenerator"/> when a chunk finishes loading.
        /// Publishes <see cref="WorldEventBus.ChunkLoaded"/> to notify interested sub-systems
        /// (road decals, performance culling, etc.).
        /// </summary>
        private void OnChunkLoaded(WorldChunk chunk)
        {
            chunk.LoadState = ChunkLoadState.Loaded;
            _roadSystem.OnChunkLoaded(chunk);
            _performanceManager.OnChunkLoaded(chunk);
            _eventBus.Publish(WorldEventBus.EventType.ChunkLoaded, chunk);
            Debug.Log($"[CityGroundSystem] Chunk {chunk.Coord} LOADED.");
        }

        /// <summary>
        /// Callback from <see cref="TerrainGenerator"/> when a chunk finishes unloading.
        /// </summary>
        private void OnChunkUnloaded(WorldChunk chunk)
        {
            chunk.LoadState = ChunkLoadState.Unloaded;
            chunk.TerrainComponent = null;
            _performanceManager.OnChunkUnloaded(chunk);
            _eventBus.Publish(WorldEventBus.EventType.ChunkUnloaded, chunk);
            Debug.Log($"[CityGroundSystem] Chunk {chunk.Coord} UNLOADED.");
        }

        // ──────────────────────────────────────────────────────────
        //  UTILITY — COORDINATE HELPERS
        // ──────────────────────────────────────────────────────────

        /// <summary>Converts a world-space position to a chunk grid coordinate.</summary>
        public Vector2Int WorldToChunkCoord(Vector3 worldPos)
        {
            float size = _config.chunkSizeMetres;
            return new Vector2Int(
                Mathf.FloorToInt(worldPos.x / size),
                Mathf.FloorToInt(worldPos.z / size)
            );
        }

        /// <summary>Converts a chunk grid coordinate to its world-space AABB.</summary>
        public Bounds ChunkCoordToBounds(Vector2Int coord)
        {
            float size   = _config.chunkSizeMetres;
            float height = 400f;  // Conservative terrain height range for AABB.
            var centre = new Vector3(
                (coord.x + 0.5f) * size,
                height * 0.5f,
                (coord.y + 0.5f) * size
            );
            return new Bounds(centre, new Vector3(size, height, size));
        }

        /// <summary>Returns true if the coordinate lies within the configured world radius.</summary>
        private bool IsCoordWithinWorldBounds(Vector2Int coord)
        {
            float size   = _config.chunkSizeMetres;
            float radius = _config.worldRadiusMetres;
            float cx     = (coord.x + 0.5f) * size;
            float cz     = (coord.y + 0.5f) * size;
            return Mathf.Abs(cx) < radius && Mathf.Abs(cz) < radius;
        }

        // ──────────────────────────────────────────────────────────
        //  PUBLIC API — External/Future System Hooks
        // ──────────────────────────────────────────────────────────

        /// <summary>
        /// [Weather Hook] Sets the current wetness level across the world.
        /// Called by a future weather system; drives materials and animations.
        /// </summary>
        public void SetWetness(float normalised01)
        {
            _groundAnimation.SetWetness(normalised01);
            _roadSystem.SetWetness(normalised01);
        }

        /// <summary>
        /// [Day-Night Hook] Sets the time-of-day (0 = midnight, 0.5 = noon, 1 = midnight).
        /// Passed straight through to <see cref="EnvironmentLighting"/>.
        /// </summary>
        public void SetTimeOfDay(float t01)
        {
            _environmentLighting.SetTimeOfDay(t01);
        }

        /// <summary>
        /// Returns the loaded <see cref="WorldChunk"/> at the given coordinate,
        /// or null if that chunk is not yet loaded.
        /// </summary>
        public WorldChunk GetChunk(Vector2Int coord)
        {
            _chunkRegistry.TryGetValue(coord, out WorldChunk chunk);
            return chunk;
        }

#if UNITY_EDITOR
        private void OnDrawGizmos()
        {
            if (!Application.isPlaying) return;
            foreach (var pair in _chunkRegistry)
            {
                WorldChunk ch = pair.Value;
                Gizmos.color = ch.LoadState == ChunkLoadState.Loaded
                    ? new Color(0, 1, 0, 0.15f)
                    : new Color(1, 0.5f, 0, 0.1f);
                Gizmos.DrawCube(ch.Bounds.center, ch.Bounds.size);
                Gizmos.color = Color.white;
                Gizmos.DrawWireCube(ch.Bounds.center, ch.Bounds.size);
            }
        }
#endif
    }

    // ──────────────────────────────────────────────────────────────
    //  WORLD EVENT BUS
    // ──────────────────────────────────────────────────────────────

    /// <summary>
    /// Lightweight publish/subscribe event bus used by all sub-systems to
    /// communicate without holding direct references to each other.
    /// Keeps coupling at near-zero while still allowing broadcast notifications.
    /// </summary>
    public sealed class WorldEventBus
    {
        public enum EventType
        {
            ChunkLoaded,
            ChunkUnloaded,
            WetnessChanged,
            TimeOfDayChanged,
            QualityTierChanged
        }

        private readonly Dictionary<EventType, List<Action<object>>> _listeners =
            new Dictionary<EventType, List<Action<object>>>();

        /// <summary>Subscribe a callback to an event type.</summary>
        public void Subscribe(EventType type, Action<object> callback)
        {
            if (!_listeners.ContainsKey(type))
                _listeners[type] = new List<Action<object>>();
            _listeners[type].Add(callback);
        }

        /// <summary>Unsubscribe a callback from an event type.</summary>
        public void Unsubscribe(EventType type, Action<object> callback)
        {
            if (_listeners.TryGetValue(type, out var list))
                list.Remove(callback);
        }

        /// <summary>Publish an event with an optional payload object.</summary>
        public void Publish(EventType type, object payload = null)
        {
            if (_listeners.TryGetValue(type, out var list))
                foreach (var cb in list)
                    cb?.Invoke(payload);
        }

        /// <summary>Remove all subscriptions (call on world destroy to prevent leaks).</summary>
        public void Clear() => _listeners.Clear();
    }

    // ──────────────────────────────────────────────────────────────
    //  BASE CLASS FOR ALL GROUND SUB-SYSTEMS
    // ──────────────────────────────────────────────────────────────

    /// <summary>
    /// Abstract base class all Phase-1 sub-systems inherit from.
    /// Provides shared access to <see cref="WorldConfig"/> and the
    /// <see cref="WorldEventBus"/> without requiring direct orchestrator references.
    /// </summary>
    public abstract class GroundSubSystem : MonoBehaviour
    {
        protected WorldConfig   Config   { get; private set; }
        protected WorldEventBus EventBus { get; private set; }
        protected bool          IsReady  { get; private set; }

        /// <summary>Called once by CityGroundSystem before Initialise.</summary>
        public void RegisterSystem(WorldConfig config, WorldEventBus bus)
        {
            Config   = config;
            EventBus = bus;
        }

        /// <summary>Override to perform one-time setup (called in Start order by orchestrator).</summary>
        public virtual void Initialise() { IsReady = true; }
    }
}
