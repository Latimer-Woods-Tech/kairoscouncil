/**
 * @module @kairos/astronomical-engine/cache
 * Transit cache management per AC-009 SLA.
 * Refresh interval: every 4 hours minimum.
 * Sub-1° transits trigger push notifications within 15 minutes.
 *
 * AC-009: All Transit Power calculations server-side only (AC-002).
 */

export { calculateTransitPower } from './transit-power.js';
export type { TransitPowerInput, TransitPowerResult } from './transit-power.js';

export { buildTransitCacheEntry, computeValidUntil } from './cache-entry-builder.js';

export { TransitCache, globalTransitCache } from './transit-cache.js';
export type { CacheRepository } from './transit-cache.js';
