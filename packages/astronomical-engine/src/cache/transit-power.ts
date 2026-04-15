/**
 * @module @kairos/astronomical-engine/cache/transit-power
 * Calculates Transit Power (AC-004) from CosmosState and natal chart data.
 * This is the primary output of the Event Mapper pipeline:
 *   Core Layer (Meeus) → Event Mapper → Transit Power → Cache Entry
 *
 * AC-004: Transit Power = Base Floor (40) + Transit Bonus + Dignity Bonus
 *         (Aspect Bonus is added by the game engine from active battlefield bonds)
 */

import type { TransitData, PlanetaryPosition, Planet, ActiveTransitAspect } from '@kairos/shared';
import {
  TRANSIT_POWER_FLOOR,
  TRANSIT_POWER_CEILING,
  ASPECT_WEIGHTS,
  DIGNITY_BONUS,
  SOLAR_RETURN_WINDOW_DAYS,
} from '@kairos/shared';
import { angularSeparation } from '../core/math-utils.js';

/**
 * Input parameters for Transit Power calculation.
 * All values come from the astronomical engine Core Layer.
 */
export interface TransitPowerInput {
  /** Active transits for this figure (sky-to-natal aspects). */
  activeTransits: TransitData[];
  /** Current planetary positions in the sky. */
  currentPositions: PlanetaryPosition[];
  /** This figure's primary ruling planet (from Forge school). */
  rulingPlanet: Planet;
  /** Natal Sun longitude in degrees (for solar return detection). */
  natalSunLongitude: number;
}

/**
 * Computed Transit Power result with breakdown for the Visible Causality Display.
 */
export interface TransitPowerResult {
  /** Final Transit Power clamped to [40, 100] — AC-004. */
  transitPower: number;
  /** Raw transit bonus before retrograde halving. */
  rawTransitBonus: number;
  /** Transit bonus after retrograde halving (if applicable). */
  transitBonus: number;
  /** Dignity bonus from the ruling planet's current sign dignity. */
  dignityBonus: number;
  /** Whether the ruling planet is retrograde this calculation. */
  retrogradeModified: boolean;
  /** Whether the figure is within its 7-day solar return window. */
  solarReturnActive: boolean;
  /** Per-transit breakdown for the Visible Causality Display. */
  activeAspects: ActiveTransitAspect[];
}

/**
 * Calculates Transit Power for a historical figure from current astronomical data.
 *
 * Implements AC-004: Transit Power Formula.
 * - Transit Bonus = Sum(exactnessScore × aspectWeight) for all active transits
 * - Retrograde: Transit Bonus halved when ruling planet is retrograde
 * - Dignity Bonus: +10 domicile/exaltation | −5 detriment/fall (ruling planet)
 * - Range: clamped to [40, 100]
 *
 * NOTE: Aspect Bonus (0–20 from battlefield bonds) is NOT computed here —
 * it is added by the game engine when bonds are active. See AC-004.
 *
 * @param input - Transits, positions, ruling planet, and natal Sun position
 * @returns Full Transit Power breakdown
 *
 * @example
 * // Napoleon: Mars conjunct natal Sun at 0.4°
 * const result = calculateTransitPower({
 *   activeTransits: marsConjunctSunTransit,
 *   currentPositions: todaysPositions,
 *   rulingPlanet: 'Mars',
 *   natalSunLongitude: 143.5,
 * });
 * // result.transitPower ≈ 78
 *
 * @see AC-004 in ARCHITECTURE.md
 */
export function calculateTransitPower(input: TransitPowerInput): TransitPowerResult {
  const { activeTransits, currentPositions, rulingPlanet, natalSunLongitude } = input;

  // ── Build per-transit breakdown ──────────────────────────────────────────
  const activeAspects: ActiveTransitAspect[] = activeTransits.map((t) => {
    const weight = ASPECT_WEIGHTS[t.aspectType];
    const contribution = t.exactnessScore * weight;
    return {
      transitingPlanet: t.transitingPlanet,
      natalPlanet: t.natalPlanet,
      type: t.aspectType,
      orb: t.orb,
      exactnessScore: t.exactnessScore,
      contribution,
    };
  });

  // ── Raw transit bonus (sum of all contributions) ─────────────────────────
  const rawTransitBonus = activeAspects.reduce((sum, a) => sum + a.contribution, 0);

  // ── Retrograde check (ruling planet) ─────────────────────────────────────
  const rulingPlanetPosition = currentPositions.find((p) => p.planet === rulingPlanet);
  const retrogradeModified = rulingPlanetPosition?.isRetrograde ?? false;

  // Transit Bonus halved when ruling planet is retrograde (AC-004)
  const transitBonus = retrogradeModified ? rawTransitBonus / 2 : rawTransitBonus;

  // ── Dignity bonus (ruling planet's current sign dignity) ─────────────────
  const dignity = rulingPlanetPosition?.dignity ?? 'peregrine';
  const dignityBonus = DIGNITY_BONUS[dignity];

  // ── Solar return check ───────────────────────────────────────────────────
  // Sun moves ~0.985°/day → 7 days ≈ 7° arc
  const currentSun = currentPositions.find((p) => p.planet === 'Sun');
  const solarReturnActive = currentSun
    ? angularSeparation(currentSun.longitude, natalSunLongitude) <= SOLAR_RETURN_WINDOW_DAYS
    : false;

  // ── Final Transit Power (no Aspect Bonus — that's game-engine state) ─────
  const raw = TRANSIT_POWER_FLOOR + transitBonus + dignityBonus;
  const transitPower = Math.round(
    Math.max(TRANSIT_POWER_FLOOR, Math.min(TRANSIT_POWER_CEILING, raw)),
  );

  return {
    transitPower,
    rawTransitBonus,
    transitBonus,
    dignityBonus,
    retrogradeModified,
    solarReturnActive,
    activeAspects,
  };
}
