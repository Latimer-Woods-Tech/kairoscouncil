/**
 * @module @kairos/astronomical-engine/cache/transit-cache
 * In-memory transit cache with 4-hour TTL and SLA validation.
 *
 * AC-009: Transit Power recalculated every 4 hours minimum.
 *         Sub-1° transits use a 15-minute refresh window.
 *         Cache misses trigger immediate recalculation.
 *
 * For Phase 0, this is an in-memory singleton cache.
 * Phase 1+: backed by Neon Postgres via CacheRepository interface.
 */

import type { TransitCacheEntry } from '@kairos/shared';

/**
 * Optional database persistence interface.
 * The in-memory cache can be backed by any storage that implements this.
 * Phase 1+: Neon Postgres implementation in @kairos/database.
 */
export interface CacheRepository {
  /**
   * Persists a cache entry to storage.
   * @param entry - The entry to store
   */
  write(entry: TransitCacheEntry): Promise<void>;

  /**
   * Reads the latest valid cache entry for a figure.
   * @param figureId - Figure UUID
   * @param now - Reference time for TTL validation
   * @returns Entry if valid, null if expired or not found
   */
  readLatest(figureId: string, now: Date): Promise<TransitCacheEntry | null>;
}

/**
 * In-memory transit cache with TTL validation.
 *
 * Thread-safety: JavaScript is single-threaded, so concurrent access within
 * a single Worker instance is safe. Cross-instance consistency relies on
 * the Neon backing store in production (Phase 1+).
 *
 * @example
 * const cache = new TransitCache();
 * cache.set(entry);
 * const hit = cache.get('figure-uuid', new Date());
 *
 * @see AC-009 — Transit Cache SLA
 */
export class TransitCache {
  private readonly store = new Map<string, TransitCacheEntry>();

  /**
   * Creates a TransitCache, optionally backed by a persistent repository.
   * @param repository - Optional persistent storage for cross-instance sync
   */
  constructor(private readonly repository?: CacheRepository) {}

  /**
   * Retrieves a valid cache entry for a figure.
   * Returns null if the entry is missing or expired.
   *
   * @param figureId - Figure UUID
   * @param now - Reference time for TTL check (default: current time)
   * @returns Valid TransitCacheEntry or null (cache miss)
   *
   * @see AC-009 — validates validUntil before returning
   */
  get(figureId: string, now: Date = new Date()): TransitCacheEntry | null {
    const entry = this.store.get(figureId);
    if (!entry) return null;
    if (entry.validUntil <= now) {
      this.store.delete(figureId);
      return null;
    }
    return entry;
  }

  /**
   * Stores a cache entry in memory and optionally persists it.
   * Overwrites any existing entry for the same figure.
   *
   * @param entry - The TransitCacheEntry to store
   */
  set(entry: TransitCacheEntry): void {
    this.store.set(entry.figureId, entry);
    // Fire-and-forget persistence — cache misses fall back to recalculation
    this.repository?.write(entry).catch(() => {
      // Persistence failure does not invalidate the in-memory cache
    });
  }

  /**
   * Checks if a valid cache entry exists for a figure without retrieving it.
   *
   * @param figureId - Figure UUID
   * @param now - Reference time for TTL check
   * @returns true if the cache entry is present and not expired
   */
  isValid(figureId: string, now: Date = new Date()): boolean {
    return this.get(figureId, now) !== null;
  }

  /**
   * Invalidates (removes) the cache entry for a specific figure.
   * Use when a figure's context changes mid-session (e.g., battlefield state change).
   *
   * @param figureId - Figure UUID to invalidate
   */
  invalidate(figureId: string): void {
    this.store.delete(figureId);
  }

  /**
   * Invalidates all cache entries.
   * Use at match start to force fresh recalculation per AC-009.
   */
  invalidateAll(): void {
    this.store.clear();
  }

  /**
   * Returns the number of currently valid cache entries.
   */
  get size(): number {
    return this.store.size;
  }

  /**
   * Returns all currently stored figure IDs (including potentially expired).
   */
  get figureIds(): string[] {
    return Array.from(this.store.keys());
  }
}

/**
 * Global singleton cache instance.
 * Each Cloudflare Worker instance has its own in-memory cache;
 * Neon Postgres provides the shared backing store in production.
 *
 * @see AC-009 — per-Worker cache with Neon backing
 */
export const globalTransitCache = new TransitCache();
