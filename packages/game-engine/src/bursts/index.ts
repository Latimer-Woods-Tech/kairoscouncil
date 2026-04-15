/**
 * @module @kairos/game-engine/bursts
 * Burst trigger evaluation for the 6 defined Bursts.
 * Trigger: named figure Ascendant + compatible event + figure's primary Forge.
 */

export { PHASE_0_BURSTS } from './burst-definitions.js';
export type { Phase0BurstDefinition } from './burst-definitions.js';

export { evaluateBurst, applyBurstEffect } from './burst-evaluator.js';
export type { TriggeredBurst } from './burst-evaluator.js';
