/**
 * @module @kairos/game-engine/bonds
 * Aspect bond logic, auto-activation, Chronos interference.
 * Bonds activate automatically — no action, no CE required.
 */

export {
  computeBondEffect,
  detectBondPair,
  createBond,
  getConfirmedAspectTypes,
  activateBondsForPlayer,
  activateAllBonds,
  expireStaleBonds,
  processChronosDelay,
} from './aspect-bonds.js';
