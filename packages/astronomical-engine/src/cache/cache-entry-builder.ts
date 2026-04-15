/**
 * @module @kairos/astronomical-engine/cache/cache-entry-builder
 * Assembles a full TransitCacheEntry from a CosmosState and natal chart.
 * Orchestrates: calculateTransitPower + getForgeIntensity + detectNamedEvents.
 *
 * AC-009: Transit Power recalculated every 4 hours minimum.
 *         Sub-1° transits trigger push notifications within 15 minutes.
 */

import type {
  TransitCacheEntry,
  HistoricalFigure,
  NatalChart,
  CosmosState,
  Planet,
} from '@kairos/shared';
import { TRANSIT_CACHE_REFRESH_HOURS, EXACT_TRANSIT_NOTIFICATION_MINUTES } from '@kairos/shared';
import { FORGE_RULING_PLANETS } from '../core/constants.js';
import { getForgeIntensity, filterRulingPlanetTransits } from '../event-mapper/forge-intensity.js';
import { detectNamedEvents } from '../event-mapper/named-events.js';
import { calculateTransitPower } from './transit-power.js';

/** One hour in milliseconds */
const MS_PER_HOUR = 3600_000;

/** One minute in milliseconds */
const MS_PER_MINUTE = 60_000;

/**
 * Determines the cache TTL for a transit entry.
 * Sub-1° transits use a shorter 15-minute window per AC-009.
 *
 * @param hasExactTransit - Whether any transit is within 1° orb
 * @param from - Reference time (default: now)
 * @returns validUntil Date
 *
 * @see AC-009 — Transit Cache SLA
 */
export function computeValidUntil(hasExactTransit: boolean, from: Date = new Date()): Date {
  const ttlMs = hasExactTransit
    ? EXACT_TRANSIT_NOTIFICATION_MINUTES * MS_PER_MINUTE
    : TRANSIT_CACHE_REFRESH_HOURS * MS_PER_HOUR;

  return new Date(from.getTime() + ttlMs);
}

/**
 * Builds a complete TransitCacheEntry for a historical figure from a CosmosState.
 *
 * Orchestration order (AC-001):
 *   1. Filter transits to ruling-planet transits (for Forge Intensity)
 *   2. Detect named celestial events
 *   3. Compute Transit Power (AC-004)
 *   4. Compute Forge Intensity (AC-007)
 *   5. Assemble cache entry with SLA-compliant TTL (AC-009)
 *
 * @param figureId - UUID of the figure in the database
 * @param figure - Historical figure card data
 * @param natalChart - Pre-computed natal chart for the figure
 * @param cosmos - Current CosmosState from the Core Layer
 * @returns Complete TransitCacheEntry ready for storage
 *
 * @example
 * const entry = buildTransitCacheEntry(
 *   napoleon.id, napoleon, napoleonChart, todaysCosmos
 * );
 * // entry.transitPower → 78
 * // entry.forgeIntensity → { primary: 3, secondary: null }
 *
 * @see AC-004 — Transit Power Formula
 * @see AC-007 — Forge Intensity
 * @see AC-009 — Transit Cache SLA
 */
export function buildTransitCacheEntry(
  figureId: string,
  figure: HistoricalFigure,
  natalChart: NatalChart,
  cosmos: CosmosState,
): TransitCacheEntry {
  const now = cosmos.timestamp;

  // ── Ruling planets for primary and secondary forge ───────────────────────
  const primaryRulingPlanets = (FORGE_RULING_PLANETS[figure.primaryForge] ?? []) as Planet[];
  const secondaryRulingPlanets = figure.secondaryForge
    ? ((FORGE_RULING_PLANETS[figure.secondaryForge] ?? []) as Planet[])
    : [];

  // ── Figure's natal Sun longitude (for solar return) ──────────────────────
  const natalSun = natalChart.planetaryPositions.find((p) => p.planet === 'Sun');
  const natalSunLongitude = natalSun?.longitude ?? 0;

  // ── Named event detection ────────────────────────────────────────────────
  const natalMars = natalChart.planetaryPositions.find((p) => p.planet === 'Mars');
  const namedEvents = detectNamedEvents(cosmos.planetaryPositions, {
    natalMarsLongitude: natalMars?.longitude,
    natalPlanetLongitudes: natalChart.planetaryPositions.map((p) => p.longitude),
    eclipseActive: cosmos.eclipseActive,
    eclipsePointLongitude: cosmos.eclipseActive
      ? cosmos.planetaryPositions.find((p) => p.planet === 'Sun')?.longitude
      : undefined,
  });

  const namedEventActive = namedEvents.length > 0;

  // ── Primary Forge Intensity ───────────────────────────────────────────────
  const primaryTransits = filterRulingPlanetTransits(
    cosmos.activeTransits,
    primaryRulingPlanets as string[],
  );
  const primaryIntensity = getForgeIntensity(primaryTransits, namedEventActive);

  // ── Secondary Forge Intensity (if applicable) ────────────────────────────
  let secondaryIntensity = null;
  if (figure.secondaryForge && secondaryRulingPlanets.length > 0) {
    const secondaryTransits = filterRulingPlanetTransits(
      cosmos.activeTransits,
      secondaryRulingPlanets as string[],
    );
    secondaryIntensity = getForgeIntensity(secondaryTransits, namedEventActive);
  }

  // ── Transit Power (AC-004) ───────────────────────────────────────────────
  const powerResult = calculateTransitPower({
    activeTransits: cosmos.activeTransits,
    currentPositions: cosmos.planetaryPositions,
    rulingPlanet: figure.rulingPlanet,
    natalSunLongitude,
  });

  // ── TTL: shorter window for sub-1° transits (AC-009) ────────────────────
  const hasExactTransit = cosmos.activeTransits.some((t) => t.orb < 1);
  const validUntil = computeValidUntil(hasExactTransit, now);

  return {
    figureId,
    calculatedAt: now,
    transitPower: powerResult.transitPower,
    activeAspects: powerResult.activeAspects,
    forgeIntensity: {
      primary: primaryIntensity,
      secondary: secondaryIntensity,
    },
    retrogradeModified: powerResult.retrogradeModified,
    solarReturnActive: powerResult.solarReturnActive,
    namedEvent: namedEvents[0] ?? null,
    validUntil,
  };
}
