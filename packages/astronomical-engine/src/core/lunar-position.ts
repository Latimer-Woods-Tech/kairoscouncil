/**
 * @module @kairos/astronomical-engine/core/lunar-position
 * Moon longitude calculation — simplified Meeus Chapter 47.
 * Uses 15 primary periodic terms for accuracy ~0.3°.
 * Sufficient for game purposes (3° orb threshold).
 * AC-001: Core Layer — no game balance values.
 */

import { normalize360, toRadians } from './math-utils.js';
import { J2000 } from './constants.js';

/**
 * Calculates the Moon's geocentric ecliptic longitude.
 * Implements the 15-term simplified approximation from Meeus Ch. 47.
 * Accuracy: ~0.3° for dates 1900–2100.
 *
 * @param jde - Julian Ephemeris Date
 * @returns Moon's longitude in degrees [0, 360)
 *
 * @see AC-001 — Core Layer boundary
 */
export function calculateMoonLongitude(jde: number): number {
  const d = jde - J2000; // days since J2000.0

  // Fundamental arguments (degrees)
  const L = normalize360(218.3165 + 13.1763966 * d);   // Moon's mean longitude
  const M = normalize360(357.5291 + 0.9856003 * d);    // Sun's mean anomaly
  const Mp = normalize360(134.9634 + 13.0649929 * d);  // Moon's mean anomaly
  const D = normalize360(297.8502 + 12.1907491 * d);   // Moon's mean elongation
  const F = normalize360(93.2720 + 13.2293721 * d);    // Argument of latitude

  // Convert to radians for trig
  const Lr = toRadians(L);
  const Mr = toRadians(M);
  const Mpr = toRadians(Mp);
  const Dr = toRadians(D);
  const Fr = toRadians(F);

  // Periodic correction terms (degrees)
  const correction =
    +6.2886 * Math.sin(Mpr) +
    -1.2740 * Math.sin(2 * Dr - Mpr) +
    +0.6583 * Math.sin(2 * Dr) +
    +0.2136 * Math.sin(2 * Mpr) +
    -0.1851 * Math.sin(Mr) +
    -0.1143 * Math.sin(2 * Fr) +
    +0.0588 * Math.sin(2 * Dr - 2 * Mpr) +
    +0.0572 * Math.sin(2 * Dr - Mr - Mpr) +
    +0.0533 * Math.sin(2 * Dr + Mpr) +
    +0.0458 * Math.sin(2 * Dr - Mr) +
    +0.0409 * Math.sin(Mpr - Mr) +
    -0.0350 * Math.sin(Dr) +
    -0.0306 * Math.sin(Mpr + Mr) +
    -0.0150 * Math.sin(2 * Fr - 2 * Dr) +
    +0.0129 * Math.sin(2 * Dr + Mr);

  // Suppress unused variable warning — Lr is the mean longitude base
  void Lr;

  return normalize360(L + correction);
}

/**
 * Calculates the Moon's geocentric ecliptic latitude (simplified).
 * Accuracy: ~0.3° for dates 1900–2100.
 *
 * @param jde - Julian Ephemeris Date
 * @returns Moon's latitude in degrees [-90, 90]
 */
export function calculateMoonLatitude(jde: number): number {
  const d = jde - J2000;

  const Mp = normalize360(134.9634 + 13.0649929 * d);
  const D = normalize360(297.8502 + 12.1907491 * d);
  const F = normalize360(93.2720 + 13.2293721 * d);

  const Mpr = toRadians(Mp);
  const Dr = toRadians(D);
  const Fr = toRadians(F);

  const lat =
    +5.1282 * Math.sin(Fr) +
    +0.2806 * Math.sin(Mpr + Fr) +
    +0.2777 * Math.sin(Mpr - Fr) +
    +0.1732 * Math.sin(2 * Dr - Fr) +
    -0.0558 * Math.sin(2 * Dr - Mpr + Fr) +
    -0.0457 * Math.sin(2 * Dr - Mpr - Fr) +
    +0.0438 * Math.sin(2 * Dr + Fr) +
    +0.0182 * Math.sin(2 * Mpr + Fr);

  return lat;
}
