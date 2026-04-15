/**
 * @module @kairos/game-engine/seed
 * Deterministic seed system — AC-003.
 * Every match locked to timestamp+seed at initiation.
 * Math.random() is BANNED — use this module for all probabilistic elements.
 */

export { SeededRandom, generateMatchSeed } from './seed.js';
