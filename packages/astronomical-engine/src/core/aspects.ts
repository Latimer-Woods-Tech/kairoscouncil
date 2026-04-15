/**
 * @module @kairos/astronomical-engine/core/aspects
 * Aspect detection between planetary positions.
 * Handles both natal-to-natal and transit-to-natal aspects.
 * Orb: 3° maximum for all aspect types (AC-009 balance constant, not here).
 * AC-001: Core Layer — no game weights applied here.
 */

import type { AspectType, AspectData, TransitData, PlanetaryPosition } from '@kairos/shared';

/** Maximum orb in degrees for aspect detection (game mechanic, defined in AC-009). */
const MAX_ORB_DEGREES = 3;

/** Exact separations for each classical aspect in degrees. */
const ASPECT_EXACT: Record<AspectType, number> = {
  conjunction: 0,
  opposition: 180,
  trine: 120,
  square: 90,
  sextile: 60,
};

/**
 * Determines the aspect type for a given angular separation, if within orb.
 *
 * @param separation - Angular separation in degrees [0, 180]
 * @returns AspectType if within 3° orb, null otherwise
 *
 * @example
 * getAspectType(0)    // → 'conjunction'
 * getAspectType(180)  // → 'opposition'
 * getAspectType(45)   // → null (no aspect within orb)
 * getAspectType(359)  // → 'conjunction' (handles wrap: 360-359=1°)
 */
export function getAspectType(separation: number): AspectType | null {
  // Normalize to [0, 180] — the shortest arc
  const norm = separation % 360;
  const sep = norm > 180 ? 360 - norm : norm;

  for (const [aspect, exact] of Object.entries(ASPECT_EXACT)) {
    const orb = Math.abs(sep - exact);
    if (orb <= MAX_ORB_DEGREES) {
      return aspect as AspectType;
    }
  }
  return null;
}

/**
 * Calculates the orb and exactness score for a given angular separation.
 * Exactness score: linear decay from 10 (exact) to 0 (at 3° orb).
 *
 * @param separation - Angular separation in degrees [0, 180]
 * @param aspectType - The aspect type to calculate orb against
 * @returns { orb, exactnessScore } where exactnessScore ∈ [0, 10]
 *
 * @example
 * calculateOrbAndExactness(0.4, 'conjunction')
 * // → { orb: 0.4, exactnessScore: ~8.67 }
 */
export function calculateOrbAndExactness(
  separation: number,
  aspectType: AspectType,
): { orb: number; exactnessScore: number } {
  const norm = separation % 360;
  const sep = norm > 180 ? 360 - norm : norm;
  const exactSep = ASPECT_EXACT[aspectType];
  const orb = Math.abs(sep - exactSep);
  const exactnessScore = Math.max(0, 10 - (orb / MAX_ORB_DEGREES) * 10);
  return { orb, exactnessScore };
}

/**
 * Computes the angular separation between two ecliptic longitudes.
 * Returns value in [0, 180].
 */
function separation(lon1: number, lon2: number): number {
  const diff = Math.abs(((lon1 - lon2 + 180) % 360 + 360) % 360 - 180);
  return diff;
}

/**
 * Determines if an aspect is applying (planets moving toward exact)
 * based on which side of the exact angle the current separation is on.
 */
function computeIsApplying(lon1: number, lon2: number, aspectType: AspectType): boolean {
  const sep = separation(lon1, lon2);
  const exactSep = ASPECT_EXACT[aspectType];
  // Applying means current separation > exact separation (approaching)
  return sep > exactSep;
}

/**
 * Detects all aspects between current planetary positions (sky-to-sky).
 * Used to populate CosmosState.activeAspects.
 *
 * @param positions - Array of current planetary positions
 * @returns Array of AspectData for all aspects within 3° orb
 *
 * @example
 * const aspects = detectAspects(planetaryPositions);
 * // Returns all planet pairs within 3° of an exact aspect
 */
export function detectAspects(positions: PlanetaryPosition[]): AspectData[] {
  const aspects: AspectData[] = [];

  for (let i = 0; i < positions.length; i++) {
    for (let j = i + 1; j < positions.length; j++) {
      const p1 = positions[i];
      const p2 = positions[j];
      if (!p1 || !p2) continue;

      const sep = separation(p1.longitude, p2.longitude);
      const aspectType = getAspectType(sep);
      if (!aspectType) continue;

      const { orb, exactnessScore } = calculateOrbAndExactness(sep, aspectType);

      aspects.push({
        planet1: p1.planet,
        planet2: p2.planet,
        type: aspectType,
        currentOrb: orb,
        exactnessScore,
        isApplying: computeIsApplying(p1.longitude, p2.longitude, aspectType),
      });
    }
  }

  return aspects;
}

/**
 * Detects transits — aspects from current sky positions to natal chart positions.
 * Used to compute figure-specific transit power.
 *
 * @param currentPositions - Current planetary positions
 * @param natalPositions - Natal planetary positions of a figure
 * @returns Array of TransitData for all active transits within 3° orb
 *
 * @example
 * // Detect Mars conjunct Napoleon's natal Sun
 * const transits = detectTransits(currentPositions, napoleonNatalPositions);
 */
export function detectTransits(
  currentPositions: PlanetaryPosition[],
  natalPositions: PlanetaryPosition[],
): TransitData[] {
  const transits: TransitData[] = [];

  for (const transiting of currentPositions) {
    for (const natal of natalPositions) {
      const sep = separation(transiting.longitude, natal.longitude);
      const aspectType = getAspectType(sep);
      if (!aspectType) continue;

      const { orb, exactnessScore } = calculateOrbAndExactness(sep, aspectType);

      transits.push({
        transitingPlanet: transiting.planet,
        natalPlanet: natal.planet,
        aspectType,
        orb,
        exactnessScore,
        isApplying: computeIsApplying(transiting.longitude, natal.longitude, aspectType),
      });
    }
  }

  return transits;
}

