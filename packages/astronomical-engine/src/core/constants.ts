/**
 * @module @kairos/astronomical-engine/core/constants
 * Astronomical constants and fundamental epoch values.
 * AC-001: Core Layer — no game concepts here.
 */

/** J2000.0 Julian Ephemeris Date — the fundamental epoch. */
export const J2000 = 2451545.0;

/** Julian Date of the Gregorian calendar reform: Oct 15, 1582 */
export const GREGORIAN_REFORM_JDE = 2299160.5;

/** Seconds per day */
export const SECONDS_PER_DAY = 86400;

/** Degrees per radian */
export const DEG_PER_RAD = 180 / Math.PI;

/** Radians per degree */
export const RAD_PER_DEG = Math.PI / 180;

/** Arcseconds per degree */
export const ARCSEC_PER_DEG = 3600;

/**
 * Orbital elements at J2000.0 for all planets.
 * Source: Meeus, "Astronomical Algorithms" 2nd Ed., Table 33.a
 *
 * Fields per planet:
 * L0: mean longitude at epoch (degrees)
 * Ln: mean longitude rate (degrees/Julian century)
 * a:  semi-major axis (AU)
 * e0: eccentricity at epoch
 * en: eccentricity rate (/Julian century)
 * i0: inclination (degrees)
 * in_: inclination rate (degrees/Julian century)
 * O0: longitude of ascending node (degrees)
 * On: node rate (degrees/Julian century)
 * w0: longitude of perihelion = Ω + ω (degrees)
 * wn: perihelion rate (degrees/Julian century)
 */
export interface OrbitalElements {
  L0: number;
  Ln: number;
  a: number;
  e0: number;
  en: number;
  i0: number;
  in_: number;
  O0: number;
  On: number;
  w0: number;
  wn: number;
}

export const ORBITAL_ELEMENTS: Record<string, OrbitalElements> = {
  Mercury: {
    L0: 252.250906, Ln: 149472.6746358,
    a: 0.387098310,
    e0: 0.20563175,  en: 0.000020406,
    i0: 7.004986,   in_: -0.0059516,
    O0: 48.330893,  On: -0.1254229,
    w0: 77.456119,  wn: 0.1588643,
  },
  Venus: {
    L0: 181.979801, Ln: 58517.8156760,
    a: 0.723329820,
    e0: 0.00677188,  en: -0.000047766,
    i0: 3.394662,   in_: -0.0008568,
    O0: 76.679920,  On: -0.2780080,
    w0: 131.563703, wn: 0.0048746,
  },
  Earth: {
    L0: 100.464457, Ln: 35999.3728565,
    a: 1.000001018,
    e0: 0.01670862,  en: -0.000042037,
    i0: 0.0,        in_: 0.0,
    O0: 0.0,        On: 0.0,
    w0: 102.937348, wn: 0.3225654,
  },
  Mars: {
    L0: 355.433275, Ln: 19140.2993313,
    a: 1.523679342,
    e0: 0.09341233,  en: 0.000090484,
    i0: 1.849726,   in_: -0.0006010,
    O0: 49.558093,  On: -0.2950250,
    w0: 336.060234, wn: 0.4438898,
  },
  Jupiter: {
    L0: 34.351519, Ln: 3034.9056606,
    a: 5.202603209,
    e0: 0.04849793,  en: 0.000163225,
    i0: 1.303270,   in_: -0.0054966,
    O0: 100.464441, On: 0.1766828,
    w0: 14.331309,  wn: 0.2155209,
  },
  Saturn: {
    L0: 50.077444, Ln: 1222.1138488,
    a: 9.554909192,
    e0: 0.05554814,  en: -0.000346641,
    i0: 2.488879,   in_: 0.0025514,
    O0: 113.665503, On: -0.2566722,
    w0: 93.057237,  wn: 0.5665415,
  },
  Uranus: {
    L0: 314.055005, Ln: 428.4669983,
    a: 19.218446062,
    e0: 0.04629590,  en: -0.000027337,
    i0: 0.769986,   in_: 0.0008897,
    O0: 74.005957,  On: 0.0741431,
    w0: 173.005291, wn: 0.0893212,
  },
  Neptune: {
    L0: 304.348665, Ln: 218.4862002,
    a: 30.110386869,
    e0: 0.00898809,  en: 0.000006408,
    i0: 1.770232,   in_: -0.0094539,
    O0: 131.784057, On: -0.0061651,
    w0: 48.120276,  wn: 0.0291866,
  },
  // Pluto: simplified elements (orbital period ≈ 248 years)
  // Less accurate but sufficient for 3° orb game detection
  Pluto: {
    L0: 238.9508, Ln: 145.1878,
    a: 39.48168677,
    e0: 0.24880766,  en: 0.0,
    i0: 17.14175,   in_: 0.0,
    O0: 110.30347,  On: 0.0,
    w0: 224.06676,  wn: 0.0,
  },
} as const;

/**
 * Forge school ruling planets.
 * Used by the Event Mapper to determine Forge Intensity.
 */
export const FORGE_RULING_PLANETS: Record<string, string[]> = {
  Phoenix: ['Mars', 'Pluto'],
  Lux: ['Sun', 'Jupiter'],
  Chronos: ['Saturn', 'Mercury'],
  Eros: ['Venus', 'Moon'],
  Aether: ['Mercury', 'Uranus'],
} as const;
