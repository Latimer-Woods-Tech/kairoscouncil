/**
 * @module @kairos/shared/constants
 * Game constants derived from AC-001 through AC-010.
 * All balance values are centralized here — never hardcoded in game logic.
 */

import type { ForgeSchool, AspectType, Archetype } from '../types/index.js';

// ─── AC-004: Transit Power Formula ───────────────────────────────────────────

/** Base floor for Transit Power — equal for ALL figures. */
export const TRANSIT_POWER_FLOOR = 40;

/** Maximum Transit Power ceiling. */
export const TRANSIT_POWER_CEILING = 100;

/** Ascendant threshold — figures with TP >= this are Ascendant. */
export const ASCENDANT_THRESHOLD = 60;

/** Aspect weights for Transit Bonus calculation — AC-004. */
export const ASPECT_WEIGHTS: Record<AspectType, number> = {
  conjunction: 3.0,
  opposition: 2.0,
  trine: 1.8,
  square: 1.5,
  sextile: 1.2,
} as const;

/** Maximum aspect orb in degrees. Beyond this, no aspect is detected. */
export const MAX_ASPECT_ORB = 3;

/** Maximum exactness score at 0° orb. Decays linearly to 0 at MAX_ASPECT_ORB. */
export const MAX_EXACTNESS_SCORE = 10;

/** Dignity bonus values — AC-004. */
export const DIGNITY_BONUS = {
  domicile: 10,
  exaltation: 10,
  detriment: -5,
  fall: -5,
  peregrine: 0,
} as const;

/** Maximum Aspect Bonus from natal aspects active on battlefield. */
export const MAX_ASPECT_BONUS = 20;

/** Solar Return window in days. */
export const SOLAR_RETURN_WINDOW_DAYS = 7;

// ─── AC-005: Attack Damage Formula ──────────────────────────────────────────

/** Forge matchup modifiers — AC-005. */
export const FORGE_MATCHUP_MODIFIERS = {
  strong: 1.1,
  neutral: 1.0,
  weak: 0.9,
} as const;

/** Dormant suppression threshold multiplier — AC-005. */
export const DORMANT_SUPPRESSION_MULTIPLIER = 0.5;

// ─── AC-006: Forge Interaction Matrix ───────────────────────────────────────

/**
 * Forge Interaction Matrix — AC-006.
 * Access as FORGE_MATRIX[attacker][defender] to get matchup type.
 */
export const FORGE_MATRIX: Record<ForgeSchool, Record<ForgeSchool, 'strong' | 'neutral' | 'weak'>> = {
  Chronos: { Chronos: 'neutral', Eros: 'neutral', Aether: 'neutral', Lux: 'weak', Phoenix: 'strong' },
  Eros: { Chronos: 'weak', Eros: 'neutral', Aether: 'strong', Lux: 'neutral', Phoenix: 'neutral' },
  Aether: { Chronos: 'neutral', Eros: 'weak', Aether: 'neutral', Lux: 'strong', Phoenix: 'neutral' },
  Lux: { Chronos: 'strong', Eros: 'neutral', Aether: 'neutral', Lux: 'neutral', Phoenix: 'weak' },
  Phoenix: { Chronos: 'neutral', Eros: 'strong', Aether: 'weak', Lux: 'neutral', Phoenix: 'neutral' },
} as const;

// ─── AC-007: Celestial Energy Economy ───────────────────────────────────────

/** Base Celestial Energy per turn. */
export const BASE_CE_PER_TURN = 3;

/** Maximum CE carryover between turns. */
export const MAX_CE_CARRYOVER = 1;

/** Maximum total CE including event bonuses. */
export const MAX_CE = 7;

/** CE cost for Chronos delay. */
export const CHRONOS_DELAY_COST = 2;

/** Maximum consecutive Chronos delays before fate asserts. */
export const MAX_CHRONOS_DELAYS = 3;

/** Transit Power penalty when Chronos max delays exceeded. */
export const CHRONOS_OVERDELAY_PENALTY = 10;

// ─── AC-008: Lux Distortion ─────────────────────────────────────────────────

/** Lux distortion range for Transit Power. */
export const LUX_TP_DISTORTION_RANGE = 8;

/** Lux distortion range for Transit Clock. */
export const LUX_CLOCK_DISTORTION_RANGE = 1;

// ─── AC-009: Transit Cache SLA ──────────────────────────────────────────────

/** Transit cache refresh interval in hours. */
export const TRANSIT_CACHE_REFRESH_HOURS = 4;

/** Sub-1° transit push notification window in minutes. */
export const EXACT_TRANSIT_NOTIFICATION_MINUTES = 15;

// ─── Phoenix Self-Immolation ────────────────────────────────────────────────

/** Phoenix return power: Floor + this bonus. */
export const PHOENIX_RETURN_BONUS = 15;

/** Phoenix Reborn immunity duration in turns. */
export const PHOENIX_REBORN_TURNS = 2;

// ─── Match Constants ────────────────────────────────────────────────────────

/** Transit Clock target for 1v1 win condition. */
export const TRANSIT_CLOCK_WIN = 13;

/** Eclipse Harmonic Clock target for co-op win. */
export const ECLIPSE_HARMONIC_WIN = 12;

/** Deck size requirement. */
export const DECK_SIZE = 20;

/** Maximum copies of a single figure in a deck. */
export const MAX_FIGURE_COPIES = 2;

/** Minimum distinct figures in a deck. */
export const MIN_DISTINCT_FIGURES = 4;

/** Maximum Event cards per deck. */
export const MAX_EVENT_CARDS = 4;

/** Maximum Transit Anchor cards per deck. */
export const MAX_TRANSIT_ANCHORS = 2;

/** Opening hand size. */
export const OPENING_HAND_SIZE = 5;

/** Square bond misfire percentage (deterministic seed). */
export const SQUARE_MISFIRE_CHANCE = 0.3;

/** Dormant figure Forge support bonus. */
export const DORMANT_SUPPORT_TP_BONUS = 5;

/** Dormant figure Forge Intensity support bonus. */
export const DORMANT_SUPPORT_FI_BONUS = 1;

/** Desperation threshold — trailing by this many ticks triggers bonus. */
export const DESPERATION_THRESHOLD = 4;

/** Celestial Inversion threshold — trailing by this many ticks. */
export const CELESTIAL_INVERSION_THRESHOLD = 5;

// ─── Forge Intensity Thresholds ─────────────────────────────────────────────

/** Forge Intensity 3 threshold: within this many degrees of exact aspect. */
export const FORGE_INTENSITY_3_ORB = 1;

/** Forge Intensity 2 threshold: within this many degrees of exact aspect. */
export const FORGE_INTENSITY_2_ORB = 5;

// ─── Archetype Adjacency ────────────────────────────────────────────────────

/** Knowledge Wheel adjacency — legal cross-archetype deckbuilding. */
export const ARCHETYPE_ADJACENCY: Record<Archetype, Archetype[]> = {
  Sovereign: ['Warrior', 'Philosopher'],
  Mystic: ['Philosopher', 'Healer'],
  Warrior: ['Sovereign', 'Poet'],
  Poet: ['Warrior', 'Healer'],
  Philosopher: ['Sovereign', 'Mystic'],
  Healer: ['Mystic', 'Poet'],
} as const;

// ─── Economy ────────────────────────────────────────────────────────────────

/** Marketplace tax rate on peer-to-peer trades. */
export const MARKETPLACE_TAX_RATE = 0.03;
