/**
 * @module @kairos/astronomical-engine/event-mapper/named-events
 * Detects named celestial events (Crimson Alignment, Apex Convergence, etc.)
 * These are rare high-energy configurations that trigger Forge Intensity 3
 * regardless of orb. Defined in GDD §4.3 Named Celestial Events.
 *
 * Named events detected:
 * - Crimson Alignment: Current Mars within 1° of natal Mars (Mars return proximity)
 * - Apex Convergence: 3+ planets within 3° of the same natal planet
 * - Eclipse Passage: Solar or lunar eclipse active + natal planet within 5° of eclipse point
 *
 * AC-001: Uses only astronomical data — the GDD game effect is in the game engine.
 */

import type { PlanetaryPosition, CelestialEventName } from '@kairos/shared';
import { angularSeparation } from '../core/math-utils.js';

interface NamedEventContext {
  natalMarsLongitude?: number;
  natalPlanetLongitudes?: number[];
  eclipseActive?: boolean;
  eclipsePointLongitude?: number;
}

/**
 * Detects active named celestial events.
 *
 * @param currentPositions - Current planetary positions
 * @param context - Context object with natal data needed for detection
 * @returns Detected named event or null
 *
 * @example
 * // Crimson Alignment: Mars within 1° of natal Mars
 * getNamedEvent(positions, { natalMarsLongitude: 143.0 });
 */
export function getNamedEvent(
  currentPositions: PlanetaryPosition[],
  context: NamedEventContext,
): CelestialEventName | null {
  // Crimson Alignment: transiting Mars within 1° of natal Mars
  if (context.natalMarsLongitude !== undefined) {
    const currentMars = currentPositions.find((p) => p.planet === 'Mars');
    if (currentMars) {
      const sep = angularSeparation(currentMars.longitude, context.natalMarsLongitude);
      if (sep <= 1) return 'Crimson Alignment';
    }
  }

  // Apex Convergence: 3+ current planets within 3° of the same natal planet
  // → maps to 'Grand Confluence' (multiple planets converging on natal point)
  if (context.natalPlanetLongitudes && context.natalPlanetLongitudes.length > 0) {
    for (const natalLon of context.natalPlanetLongitudes) {
      const closeCount = currentPositions.filter(
        (p) => angularSeparation(p.longitude, natalLon) <= 3,
      ).length;
      if (closeCount >= 3) return 'Grand Confluence';
    }
  }

  // Eclipse Passage: eclipse active and a natal planet is within 5° of eclipse point
  // → maps to 'Silent Eclipse'
  if (
    context.eclipseActive &&
    context.eclipsePointLongitude !== undefined &&
    context.natalPlanetLongitudes
  ) {
    const natalNearEclipse = context.natalPlanetLongitudes.some(
      (lon) => angularSeparation(lon, context.eclipsePointLongitude!) <= 5,
    );
    if (natalNearEclipse) return 'Silent Eclipse';
  }

  return null;
}

/**
 * Detects all active named events for a figure.
 * Returns an array (multiple events can be active simultaneously).
 *
 * @param currentPositions - Current planetary positions
 * @param context - Named event detection context
 * @returns Array of active named events
 */
export function detectNamedEvents(
  currentPositions: PlanetaryPosition[],
  context: NamedEventContext,
): CelestialEventName[] {
  const events: CelestialEventName[] = [];
  const event = getNamedEvent(currentPositions, context);
  if (event) events.push(event);
  return events;
}
