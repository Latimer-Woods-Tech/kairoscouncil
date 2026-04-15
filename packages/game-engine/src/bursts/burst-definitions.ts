/**
 * @module @kairos/game-engine/bursts/burst-definitions
 * The 6 Burst definitions for the Phase 0 roster.
 *
 * Burst trigger requirements (GAME_DESIGN.md §8.3):
 *   1. Specific named figure is Ascendant in your Council
 *   2. A compatible named celestial event is currently active
 *   3. You declare an attack using that figure's PRIMARY Forge school
 *
 * @see GAME_DESIGN.md §8.3 Burst System
 */

import type { BurstDefinition, CelestialEventName, ForgeSchool } from '@kairos/shared';

/**
 * Extended burst definition with figure name for Phase 0 lookup.
 * The figure ID is resolved at runtime against the database.
 */
export interface Phase0BurstDefinition extends BurstDefinition {
  /** Name of the triggering figure — used for Phase 0 seed-data matching. */
  triggerFigureName: string;
  /** The Forge school that must be used in the attack. */
  requiredForge: ForgeSchool;
  /** The celestial event that must be active. */
  requiredEvent: CelestialEventName;
  /** Additional structural conditions (e.g., minimum active bonds). */
  requiredActiveBonds?: number;
}

/**
 * All 6 Phase 0 Burst definitions.
 * Triggers are deterministic — figure + event + forge school must all align.
 *
 * @see GAME_DESIGN.md §8.3
 */
export const PHASE_0_BURSTS: Phase0BurstDefinition[] = [
  {
    name: 'Court of Desire',
    triggerFigureName: 'Cleopatra VII',
    requiredFigureId: '', // Resolved at runtime from DB
    requiredEvent: 'Venus Ascendant',
    requiredForge: 'Eros',
    effect:
      'Attack ignores Forge resistance. Target\'s bonds severed for 2 turns. +3 CE.',
  },
  {
    name: 'The Eternal March',
    triggerFigureName: 'Napoleon Bonaparte',
    requiredFigureId: '',
    requiredEvent: 'Crimson Alignment',
    requiredForge: 'Phoenix',
    effect:
      'If this attack suppresses the target, Napoleon does not exhaust. May attack again this turn.',
  },
  {
    name: 'Harmonic Proof',
    triggerFigureName: 'Pythagoras',
    requiredFigureId: '',
    requiredEvent: 'Grand Confluence',
    requiredForge: 'Aether',
    effect:
      'All council figures +5 Transit Power. Reveal opponent\'s hand for 1 turn.',
  },
  {
    name: 'The Burning Word',
    triggerFigureName: 'Rumi',
    requiredFigureId: '',
    requiredEvent: 'Venus Ascendant',
    requiredForge: 'Eros',
    requiredActiveBonds: 2,
    effect:
      'All bonds generate Burst CE (5 CE total). Harmonic Clock +2 in Eclipse mode.',
  },
  {
    name: 'Silent Authority',
    triggerFigureName: 'Julius Caesar',
    requiredFigureId: '',
    requiredEvent: 'Jupiter Ascension',
    requiredForge: 'Lux',
    effect:
      "Opponent's Transit Clock frozen for 1 turn. Their Forecast distortion doubled.",
  },
  {
    name: 'Logos Barrier',
    triggerFigureName: 'Hypatia',
    requiredFigureId: '',
    requiredEvent: 'Grand Confluence',
    requiredForge: 'Aether',
    effect:
      'All Aether effects on your battlefield are amplified +20% for 2 turns. Opponent cannot target your Mystic figures.',
  },
];
