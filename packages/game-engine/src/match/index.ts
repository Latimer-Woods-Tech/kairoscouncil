/**
 * @module @kairos/game-engine/match
 * Match initialization, state management, turn resolution.
 * AC-002: Server-side authority. AC-003: Deterministic seeds.
 */

export {
  validateDeck,
  determineFirstPlayer,
  createCardInstance,
  initializeMatch,
} from './match-init.js';
export type { DeckValidationResult, DeckInput, InitMatchInput } from './match-init.js';

export {
  computeCEIncome,
  applyCelestialUpdate,
  determineStateFromPower,
  processCelestialUpdatePhase,
  processDrawPhase,
  processPassPhase,
  summonFigure,
} from './turn-resolution.js';
export type { CelestialUpdateResult } from './turn-resolution.js';
