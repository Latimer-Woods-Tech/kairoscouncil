/**
 * @module @kairos/astronomical-engine/core/math-utils
 * Mathematical utilities for astronomical calculations.
 * All angles in degrees unless otherwise specified.
 * AC-001: Pure math — no game concepts.
 */

import { DEG_PER_RAD, RAD_PER_DEG } from './constants.js';

/**
 * Converts degrees to radians.
 * @param deg - Angle in degrees
 * @returns Angle in radians
 */
export function toRadians(deg: number): number {
  return deg * RAD_PER_DEG;
}

/**
 * Converts radians to degrees.
 * @param rad - Angle in radians
 * @returns Angle in degrees
 */
export function toDegrees(rad: number): number {
  return rad * DEG_PER_RAD;
}

/**
 * Normalizes an angle to [0, 360) degrees.
 * Handles both positive and large negative values.
 * @param deg - Angle in degrees (any value)
 * @returns Angle normalized to [0, 360)
 */
export function normalize360(deg: number): number {
  const result = deg % 360;
  return result < 0 ? result + 360 : result;
}

/**
 * Computes the shortest angular difference between two angles.
 * Result is in [-180, 180].
 * @param a - First angle in degrees
 * @param b - Second angle in degrees
 * @returns Shortest difference in degrees, signed
 */
export function angularDifferenceSigned(a: number, b: number): number {
  let diff = normalize360(b - a);
  if (diff > 180) diff -= 360;
  return diff;
}

/**
 * Computes the absolute shortest angular separation between two angles.
 * Result is in [0, 180].
 * @param a - First angle in degrees
 * @param b - Second angle in degrees
 * @returns Absolute angular separation in degrees [0, 180]
 */
export function angularSeparation(a: number, b: number): number {
  return Math.abs(angularDifferenceSigned(a, b));
}

/**
 * Returns the sign name for a given ecliptic longitude.
 * @param longitude - Ecliptic longitude in degrees [0, 360)
 * @returns Zodiac sign name
 */
export function longitudeToSign(longitude: number): string {
  const signs = [
    'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
    'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces',
  ];
  const index = Math.floor(normalize360(longitude) / 30);
  return signs[index] ?? 'Aries';
}

/**
 * Returns the degree within the sign (0–29.99) for a longitude.
 * @param longitude - Ecliptic longitude in degrees [0, 360)
 * @returns Degree within sign [0, 30)
 */
export function longitudeToSignDegree(longitude: number): number {
  return normalize360(longitude) % 30;
}

/**
 * Solves Kepler's equation E = M + e*sin(E) using Newton-Raphson iteration.
 * Converges to 1e-10 precision in a few iterations.
 * @param M - Mean anomaly in radians
 * @param e - Eccentricity [0, 1)
 * @returns Eccentric anomaly E in radians
 */
export function solveKepler(M: number, e: number): number {
  let E = M; // initial estimate
  for (let i = 0; i < 50; i++) {
    const delta = (M - E + e * Math.sin(E)) / (1 - e * Math.cos(E));
    E += delta;
    if (Math.abs(delta) < 1e-12) break;
  }
  return E;
}

/**
 * Computes the true anomaly from eccentric anomaly and eccentricity.
 * @param E - Eccentric anomaly in radians
 * @param e - Eccentricity [0, 1)
 * @returns True anomaly in radians
 */
export function trueAnomaly(E: number, e: number): number {
  return 2 * Math.atan2(
    Math.sqrt(1 + e) * Math.sin(E / 2),
    Math.sqrt(1 - e) * Math.cos(E / 2),
  );
}
