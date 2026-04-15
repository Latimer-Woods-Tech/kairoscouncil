/**
 * @module @kairos/astronomical-engine/core/cosmos-state
 * Assembles the CosmosState — the AC-001 boundary type between Core Layer
 * and the game engine. Contains current planetary positions, sky-to-sky
 * aspects, and optionally figure-specific transits when natal chart provided.
 * AC-001: Core Layer output.
 */

import type { CosmosState, NatalChart } from '@kairos/shared';
import { calculatePlanetaryPositions } from './planetary-positions.js';
import { detectAspects, detectTransits } from './aspects.js';
import { jsDateToJDE } from './julian-date.js';
import { J2000 } from './constants.js';
import { normalize360 } from './math-utils.js';

/**
 * Detects if a solar or lunar eclipse is active near the given JDE.
 * Eclipse condition: New/Full Moon within ~2° of a lunar node.
 *
 * @param sunLon - Sun's longitude
 * @param moonLon - Moon's longitude
 * @param jde - Julian Ephemeris Date (for node calculation)
 * @returns Eclipse type or undefined
 */
function detectEclipse(
  sunLon: number,
  moonLon: number,
  jde: number,
): { active: boolean; type?: 'solar' | 'lunar' } {
  // Longitude of the lunar ascending node (simplified)
  const d = jde - J2000;
  const nodeAscending = normalize360(125.0445 - 0.0529539 * d);
  const nodeDescending = normalize360(nodeAscending + 180);

  // Sun-Moon separation
  const synAngle = normalize360(moonLon - sunLon);
  const isNewMoon = synAngle < 5 || synAngle > 355;
  const isFullMoon = synAngle > 175 && synAngle < 185;

  if (!isNewMoon && !isFullMoon) return { active: false };

  // Check if Moon is near a node (within 2° — tight eclipse window)
  const distToAsc = Math.min(
    Math.abs(normalize360(moonLon - nodeAscending)),
    360 - Math.abs(normalize360(moonLon - nodeAscending)),
  );
  const distToDesc = Math.min(
    Math.abs(normalize360(moonLon - nodeDescending)),
    360 - Math.abs(normalize360(moonLon - nodeDescending)),
  );
  const nearNode = distToAsc < 15 || distToDesc < 15; // 15° eclipse limit

  if (!nearNode) return { active: false };

  return {
    active: true,
    type: isNewMoon ? 'solar' : 'lunar',
  };
}

/**
 * Computes the CosmosState for a given time and optional natal chart.
 *
 * - Without natal chart: returns global sky state (positions + sky aspects)
 * - With natal chart: additionally computes figure-specific transits
 *
 * @param jde - Julian Ephemeris Date
 * @param natalChart - Optional natal chart for transit detection
 * @returns Assembled CosmosState
 *
 * @example
 * // Global state (no transits)
 * const state = computeCosmosState(2451545.0);
 *
 * // Figure-specific state with transits
 * const state = computeCosmosState(now, napoleonChart);
 *
 * @see AC-001 — this is the primary Core Layer output
 */
export function computeCosmosState(jde: number, natalChart?: NatalChart): CosmosState {
  const positions = calculatePlanetaryPositions(jde);
  const skyAspects = detectAspects(positions);

  const transits = natalChart
    ? detectTransits(positions, natalChart.planetaryPositions)
    : [];

  const sun = positions.find((p) => p.planet === 'Sun');
  const moon = positions.find((p) => p.planet === 'Moon');

  const eclipse =
    sun && moon
      ? detectEclipse(sun.longitude, moon.longitude, jde)
      : { active: false };

  // Approximate timestamp from JDE
  const msFromEpoch = (jde - 2440587.5) * 86400000;
  const timestamp = new Date(msFromEpoch);

  return {
    timestamp,
    julianDate: jde,
    planetaryPositions: positions,
    activeTransits: transits,
    activeAspects: skyAspects,
    eclipseActive: eclipse.active,
    eclipseType: eclipse.type,
  };
}

/**
 * Convenience: computes CosmosState from a JavaScript Date.
 *
 * @param date - JavaScript Date (uses UTC)
 * @param natalChart - Optional natal chart for transit detection
 * @returns Assembled CosmosState
 */
export function computeCosmosStateFromDate(date: Date, natalChart?: NatalChart): CosmosState {
  const jde = jsDateToJDE(date);
  return computeCosmosState(jde, natalChart);
}
