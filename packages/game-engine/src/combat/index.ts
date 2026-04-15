/**
 * @module @kairos/game-engine/combat
 * Damage calculation, suppression, Dormant actions.
 * Implements AC-005: Attack Damage Formula.
 */

export {
  getForgeMatchup,
  calculateAspectBonus,
  getEffectiveTransitPower,
  calculateAttackDamage,
  resolveAttack,
  processDormantAction,
  processPhoenixImmolation,
  processPhoenixReturns,
} from './damage.js';
