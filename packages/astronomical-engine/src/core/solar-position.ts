/**
 * @module @kairos/astronomical-engine/core/solar-position
 * Accurate Sun longitude calculation.
 * Implements Meeus "Astronomical Algorithms" Chapter 25.
 * Accuracy: ~0.01° over years 1950–2050.
 * AC-001: Core Layer — no game balance values.
 */

import { julianCenturies } from './julian-date.js';
import { normalize360, toRadians } from './math-utils.js';

/**
 * Calculates the apparent geocentric ecliptic longitude of the Sun.
 * Uses the full Meeus Chapter 25 formula including equation of center,
 * nutation correction, and aberration.
 *
 * @param jde - Julian Ephemeris Date
 * @returns Sun's apparent longitude in degrees [0, 360)
 *
 * @example
 * // J2000.0 — Sun in Capricorn (~280°)
 * const lon = calculateSunLongitude(2451545.0); // → ~280.46
 *
 * @see AC-001 — Core Layer boundary
 */
export function calculateSunLongitude(jde: number): number {
  const T = julianCenturies(jde);

  // Geometric mean longitude of the Sun (degrees)
  const L0 = normalize360(280.46646 + 36000.76983 * T + 0.0003032 * T * T);

  // Mean anomaly of the Sun (degrees)
  const M = normalize360(357.52911 + 35999.05029 * T - 0.0001537 * T * T);
  const Mrad = toRadians(M);

  // Sun's equation of center (degrees)
  const C =
    (1.914602 - 0.004817 * T - 0.000014 * T * T) * Math.sin(Mrad) +
    (0.019993 - 0.000101 * T) * Math.sin(2 * Mrad) +
    0.000289 * Math.sin(3 * Mrad);

  // Sun's true longitude (degrees)
  const sunLon = L0 + C;

  // Apparent longitude: apply nutation and aberration (small correction)
  const omega = normalize360(125.04 - 1934.136 * T);
  const apparentLon = sunLon - 0.00569 - 0.00478 * Math.sin(toRadians(omega));

  return normalize360(apparentLon);
}

/**
 * Calculates the Sun's radius vector (distance from Earth) in AU.
 * Used for eclipse magnitude calculations.
 *
 * @param jde - Julian Ephemeris Date
 * @returns Distance in Astronomical Units
 */
export function calculateSunDistance(jde: number): number {
  const T = julianCenturies(jde);

  // Mean anomaly
  const M = normalize360(357.52911 + 35999.05029 * T - 0.0001537 * T * T);
  const Mrad = toRadians(M);

  // Eccentricity
  const e = 0.016708634 - 0.000042037 * T - 0.0000001267 * T * T;

  // Equation of center (radians)
  const C =
    (1.9146 - 0.004817 * T) * Math.sin(Mrad) +
    0.019993 * Math.sin(2 * Mrad);
  const vrad = toRadians(M + C);

  return (1.000001018 * (1 - e * e)) / (1 + e * Math.cos(vrad));
}
