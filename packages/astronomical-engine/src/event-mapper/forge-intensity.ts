/**
 * @module @kairos/astronomical-engine/event-mapper/forge-intensity
 * Translates raw transit orb data into Forge Intensity (1, 2, or 3).
 * Forge Intensity is a game concept (AC-007) computed from astronomical data.
 * This is the bridge: astronomical output → game-meaningful state.
 *
 * AC-007: 1=ruling planet >5° | 2=within 5° | 3=within 1° OR named event active
 */

import type { TransitData, ForgeIntensity } from '@kairos/shared';

/**
 * Computes Forge Intensity from the figure's relevant transit data.
 * The caller is responsible for filtering transits to only those involving
 * the figure's Forge ruling planet(s).
 *
 * @param rulingPlanetTransits - Transits involving the figure's Forge ruling planet
 * @param namedEventActive - Whether a named celestial event (e.g., Crimson Alignment) is active
 * @returns ForgeIntensity level 1, 2, or 3
 *
 * @example
 * // Napoleon (Phoenix Forge, ruling planet = Mars)
 * // Mars at 0.4° from natal Sun
 * const intensity = getForgeIntensity(marsTransits); // → 3
 *
 * @see AC-007 — Forge Intensity thresholds
 * @see FORGE_INTENSITY_3_ORB, FORGE_INTENSITY_2_ORB constants in @kairos/shared
 */
export function getForgeIntensity(
  rulingPlanetTransits: TransitData[],
  namedEventActive = false,
): ForgeIntensity {
  // Named event always overrides to maximum intensity
  if (namedEventActive) return 3;

  if (rulingPlanetTransits.length === 0) return 1;

  // Find the minimum orb (closest to exact aspect)
  const minOrb = Math.min(...rulingPlanetTransits.map((t) => t.orb));

  if (minOrb <= 1) return 3;  // Within 1° → Intensity 3
  if (minOrb <= 5) return 2;  // Within 5° → Intensity 2
  return 1;                   // Beyond 5° → Intensity 1
}

/**
 * Filters a transit array to only include transits involving a specific planet
 * as the transiting planet. Used to isolate ruling planet transits for Forge Intensity.
 *
 * @param transits - All active transits for a figure
 * @param rulingPlanets - Planet names to filter for (primary and secondary ruling planet)
 * @returns Filtered transits involving the ruling planet
 */
export function filterRulingPlanetTransits(
  transits: TransitData[],
  rulingPlanets: string[],
): TransitData[] {
  return transits.filter((t) => rulingPlanets.includes(t.transitingPlanet));
}
