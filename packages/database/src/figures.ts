/**
 * @module @kairos/database/figures
 * Phase 0 roster — 10 historical figures with birth data and computed natal chart metadata.
 *
 * Birth dates use astronomical year numbering:
 *   1 BC = year 0, 69 BC = year -68, etc.
 * Pre-Gregorian dates use the Julian calendar (isGregorian: false).
 * All times default to noon (0.5 fractional day) when birth time is unknown.
 *
 * @see GAME_DESIGN.md — Phase 0 Roster
 * @see packages/astronomical-engine/src/core/natal-chart.ts — chart computation
 */

/** Birth data for a Phase 0 figure, including calendar metadata. */
export interface FigureBirthData {
  /** Astronomical year (1 BC = 0, 2 BC = -1). */
  year: number;
  month: number;
  /** Day, with 0.5 fractional day = noon. */
  day: number;
  /** true = Gregorian calendar, false = Julian. */
  isGregorian: boolean;
  lat?: number;
  lng?: number;
}

/** Raw seed data for a Phase 0 figure. */
export interface FigureSeedData {
  name: string;
  birthData: FigureBirthData;
  birthDatePrecision: 'verified' | 'estimated' | 'attributed' | 'legendary';
  archetypeSchool: 'Sovereign' | 'Mystic' | 'Warrior' | 'Poet' | 'Philosopher' | 'Healer';
  primaryForge: 'Chronos' | 'Eros' | 'Aether' | 'Lux' | 'Phoenix';
  secondaryForge?: 'Chronos' | 'Eros' | 'Aether' | 'Lux' | 'Phoenix';
  rulingPlanet: 'Sun' | 'Moon' | 'Mercury' | 'Venus' | 'Mars' | 'Jupiter' | 'Saturn' | 'Uranus' | 'Neptune' | 'Pluto';
  era: string;
  personalLore: string;
}

/**
 * Phase 0 roster — 10 historical figures.
 * Ordered by era (oldest first) to make natal chart computation deterministic.
 */
export const PHASE_0_FIGURES: FigureSeedData[] = [
  // ── 1. Sun Tzu ─────────────────────────────────────────────────────────────
  {
    name: 'Sun Tzu',
    birthData: {
      year: -543,  // 544 BC in astronomical year numbering
      month: 1,
      day: 1.5,
      isGregorian: false,
      lat: 36.0,
      lng: 117.0,
    },
    birthDatePrecision: 'legendary',
    archetypeSchool: 'Mystic',
    primaryForge: 'Lux',
    rulingPlanet: 'Jupiter',
    era: 'Ancient China',
    personalLore:
      "The cosmos was his general. He did not fight the sky — he waited for it to fight for him. The Art of War is a transit prediction disguised as military strategy.",
  },

  // ── 2. Sappho ──────────────────────────────────────────────────────────────
  {
    name: 'Sappho',
    birthData: {
      year: -629,  // 630 BC
      month: 1,
      day: 1.5,
      isGregorian: false,
      lat: 39.1,
      lng: 26.3,
    },
    birthDatePrecision: 'legendary',
    archetypeSchool: 'Poet',
    primaryForge: 'Eros',
    rulingPlanet: 'Venus',
    era: 'Ancient Greece',
    personalLore:
      "She wrote to Venus as if dictating letters to a close friend. Her transit window still opens every 8 years when Venus returns to Lesbos-rising.",
  },

  // ── 3. Pythagoras ──────────────────────────────────────────────────────────
  {
    name: 'Pythagoras',
    birthData: {
      year: -569,  // 570 BC
      month: 1,
      day: 1.5,
      isGregorian: false,
      lat: 37.8,
      lng: 26.8,
    },
    birthDatePrecision: 'legendary',
    archetypeSchool: 'Philosopher',
    primaryForge: 'Aether',
    rulingPlanet: 'Uranus',
    era: 'Ancient Greece',
    personalLore:
      "He did not discover the harmony of the spheres — he measured it. Every Grand Confluence is a Pythagorean theorem proving itself in real time.",
  },

  // ── 4. Hannibal Barca ──────────────────────────────────────────────────────
  {
    name: 'Hannibal Barca',
    birthData: {
      year: -246,  // 247 BC
      month: 1,
      day: 1.5,
      isGregorian: false,
      lat: 36.9,
      lng: 10.3,
    },
    birthDatePrecision: 'attributed',
    archetypeSchool: 'Warrior',
    primaryForge: 'Phoenix',
    rulingPlanet: 'Mars',
    era: 'Ancient Carthage',
    personalLore:
      "He crossed the Alps when Mars was exalted — his transit window opened and he walked an army through the impossible. The elephants were just the visible part.",
  },

  // ── 5. Julius Caesar ───────────────────────────────────────────────────────
  {
    name: 'Julius Caesar',
    birthData: {
      year: -99,  // 100 BC
      month: 7,
      day: 13.5,
      isGregorian: false,
      lat: 41.9,
      lng: 12.5,
    },
    birthDatePrecision: 'attributed',
    archetypeSchool: 'Sovereign',
    primaryForge: 'Lux',
    rulingPlanet: 'Sun',
    era: 'Roman Republic',
    personalLore:
      "He named himself a god while Jupiter transited his natal Sun. The Senate saw a tyrant. The cosmos saw a solar return.",
  },

  // ── 6. Hypatia ─────────────────────────────────────────────────────────────
  {
    name: 'Hypatia',
    birthData: {
      year: 360,
      month: 1,
      day: 1.5,
      isGregorian: false,
      lat: 31.2,
      lng: 29.9,
    },
    birthDatePrecision: 'attributed',
    archetypeSchool: 'Mystic',
    primaryForge: 'Aether',
    rulingPlanet: 'Mercury',
    era: 'Late Roman Empire',
    personalLore:
      "She taught the movement of celestial bodies to men who then used that movement to justify her death. Mercury was retrograde. The Aether fracture was already forming.",
  },

  // ── 7. Hildegard von Bingen ────────────────────────────────────────────────
  {
    name: 'Hildegard von Bingen',
    birthData: {
      year: 1098,
      month: 9,
      day: 16.5,
      isGregorian: false,
      lat: 49.8,
      lng: 8.0,
    },
    birthDatePrecision: 'attributed',
    archetypeSchool: 'Healer',
    primaryForge: 'Eros',
    rulingPlanet: 'Moon',
    era: 'Medieval Germany',
    personalLore:
      "She received her visions when the Moon crossed her natal Venus. She called them illuminations. The Event Mapper calls them Venus Ascendant windows.",
  },

  // ── 8. Rumi ────────────────────────────────────────────────────────────────
  {
    name: 'Rumi',
    birthData: {
      year: 1207,
      month: 9,
      day: 30.5,
      isGregorian: false,
      lat: 36.8,
      lng: 66.9,
    },
    birthDatePrecision: 'verified',
    archetypeSchool: 'Poet',
    primaryForge: 'Eros',
    rulingPlanet: 'Venus',
    era: 'Persian Empire',
    personalLore:
      "He met Shams of Tabriz during a Venus-Jupiter conjunction. Every bond he ever formed was a transit documented in verse. The Burning Word activates when Venus returns.",
  },

  // ── 9. Cleopatra VII ───────────────────────────────────────────────────────
  {
    name: 'Cleopatra VII',
    birthData: {
      year: -68,  // 69 BC
      month: 1,
      day: 1.5,
      isGregorian: false,
      lat: 31.2,
      lng: 29.9,
    },
    birthDatePrecision: 'attributed',
    archetypeSchool: 'Sovereign',
    primaryForge: 'Eros',
    rulingPlanet: 'Venus',
    era: 'Ptolemaic Egypt',
    personalLore:
      "She spoke nine languages and timed every political move to the Nile's astronomical calendar. The Court of Desire is not metaphor — it is a Venus transit strategy.",
  },

  // ── 10. Napoleon Bonaparte ─────────────────────────────────────────────────
  {
    name: 'Napoleon Bonaparte',
    birthData: {
      year: 1769,
      month: 8,
      day: 15.5,
      isGregorian: true,
      lat: 41.9196,
      lng: 8.7386,
    },
    birthDatePrecision: 'verified',
    archetypeSchool: 'Warrior',
    primaryForge: 'Phoenix',
    rulingPlanet: 'Mars',
    era: 'Revolutionary France',
    personalLore:
      "His greatest victories came when Mars transited his natal Sun in Leo. His final defeat at Waterloo happened when Mars was retrograde. He did not know this. Now you do.",
  },
];
