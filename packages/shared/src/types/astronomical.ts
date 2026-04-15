/**
 * @module @kairos/shared/types/astronomical
 * Types for the astronomical engine core layer and event mapper.
 * Referenced by AC-001: Two-Layer Astronomical Architecture.
 */

/** Planetary bodies tracked by the Meeus engine. */
export type Planet =
  | 'Sun'
  | 'Moon'
  | 'Mercury'
  | 'Venus'
  | 'Mars'
  | 'Jupiter'
  | 'Saturn'
  | 'Uranus'
  | 'Neptune'
  | 'Pluto';

/** Zodiac signs for dignity/detriment evaluation. */
export type ZodiacSign =
  | 'Aries'
  | 'Taurus'
  | 'Gemini'
  | 'Cancer'
  | 'Leo'
  | 'Virgo'
  | 'Libra'
  | 'Scorpio'
  | 'Sagittarius'
  | 'Capricorn'
  | 'Aquarius'
  | 'Pisces';

/** Aspect types with their exact angular separations. */
export type AspectType = 'conjunction' | 'opposition' | 'trine' | 'square' | 'sextile';

/** Dignity state of a planet in a sign. */
export type DignityState = 'domicile' | 'exaltation' | 'detriment' | 'fall' | 'peregrine';

/** A single planetary position at a point in time. */
export interface PlanetaryPosition {
  planet: Planet;
  longitude: number;
  latitude: number;
  sign: ZodiacSign;
  degree: number;
  isRetrograde: boolean;
  dignity: DignityState;
}

/** A detected aspect between two planetary positions (sky-to-sky). */
export interface AspectData {
  planet1: Planet;
  planet2: Planet;
  type: AspectType;
  currentOrb: number;
  exactnessScore: number;
  isApplying: boolean;
}

/** Transit between a transiting planet and a natal planet. */
export interface TransitData {
  transitingPlanet: Planet;
  natalPlanet: Planet;
  aspectType: AspectType;
  orb: number;
  exactnessScore: number;
  isApplying: boolean;
}

/**
 * Complete cosmos state at a point in time.
 * This is the Core Layer output — AC-001 boundary.
 * The Event Mapper consumes this to produce named game states.
 */
export interface CosmosState {
  timestamp: Date;
  julianDate: number;
  planetaryPositions: PlanetaryPosition[];
  activeTransits: TransitData[];
  activeAspects: AspectData[];
  eclipseActive: boolean;
  eclipseType?: 'solar' | 'lunar';
}

/** Birth data for natal chart calculation. */
export interface BirthData {
  date: Date;
  latitude?: number;
  longitude?: number;
  timeKnown: boolean;
}

/** Natal chart calculated from birth data. */
export interface NatalChart {
  birthData: BirthData;
  julianDate: number;
  planetaryPositions: PlanetaryPosition[];
  natalAspects: AspectData[];
}
