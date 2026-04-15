/**
 * @module @kairos/game-engine/bursts/burst-evaluator
 * Evaluates Burst trigger conditions against current match state.
 *
 * Burst trigger is deterministic (not probabilistic) — all three conditions
 * must simultaneously be true. No randomness involved (AC-003 not required here).
 *
 * @see GAME_DESIGN.md §8.3 Burst System
 */

import type { MatchState, CardInstance, CosmosSnapshot } from '@kairos/shared';
import { PHASE_0_BURSTS, type Phase0BurstDefinition } from './burst-definitions.js';

/**
 * A triggered Burst ready for effect resolution.
 */
export interface TriggeredBurst {
  burst: Phase0BurstDefinition;
  triggeringFigure: CardInstance;
  /** The attack action that triggered the burst. */
  attackForge: string;
}

/**
 * Evaluates whether any Burst condition is satisfied for the current attack.
 *
 * Checks all 3 conditions for each Phase 0 Burst:
 *   1. Named figure is Ascendant in the active player's council
 *   2. Required named celestial event is active in the cosmos
 *   3. Attack is declared using that figure's primary Forge school
 *   4. (Optional) Minimum active bonds in council
 *
 * @param match - Current match state
 * @param attackingFigureId - The figure declaring the attack
 * @param attackForge - The Forge school used in the attack
 * @param cosmos - Current cosmos snapshot
 * @param figureIdByName - Map from figure name → DB UUID (resolved from seed data)
 * @returns TriggeredBurst if conditions met, null otherwise
 *
 * @example
 * // Napoleon attacks with Phoenix during Crimson Alignment
 * const burst = evaluateBurst(match, napoleon.id, 'Phoenix', cosmos, figureIds);
 * // Returns { burst: Eternal March, ... }
 *
 * @see GAME_DESIGN.md §8.3
 */
export function evaluateBurst(
  match: MatchState,
  attackingFigureId: string,
  attackForge: string,
  cosmos: CosmosSnapshot,
  figureIdByName: Map<string, string>,
): TriggeredBurst | null {
  const activePlayer = match.players.find((p) => p.playerId === match.activePlayerId);
  if (!activePlayer) return null;

  const attackingCard = activePlayer.battlefield.find(
    (c) => c.figureId === attackingFigureId,
  );
  if (!attackingCard || attackingCard.state !== 'Ascendant') return null;

  for (const burstDef of PHASE_0_BURSTS) {
    // Condition 1: Is the specific figure Ascendant in the active player's council?
    const resolvedFigureId = figureIdByName.get(burstDef.triggerFigureName);
    if (!resolvedFigureId || resolvedFigureId !== attackingFigureId) continue;

    // Condition 2: Is the required named event currently active?
    if (!cosmos.activeEvents.includes(burstDef.requiredEvent)) continue;

    // Condition 3: Is the attack using the required Forge school?
    if (attackForge !== burstDef.requiredForge) continue;

    // Condition 4 (optional): Minimum active bonds
    if (burstDef.requiredActiveBonds !== undefined) {
      const activeBondCount = activePlayer.battlefield.reduce(
        (sum, card) => sum + card.activeAspectBonds.filter((b) => b.isActive).length,
        0,
      );
      // Each bond is stored on both figures, so divide by 2
      const uniqueBonds = Math.floor(activeBondCount / 2);
      if (uniqueBonds < burstDef.requiredActiveBonds) continue;
    }

    return { burst: burstDef, triggeringFigure: attackingCard, attackForge };
  }

  return null;
}

/**
 * Applies the effect of a triggered Burst to the match state.
 * Effects are narrative-driven; mechanical consequences implemented here.
 *
 * @param match - Current match state
 * @param triggered - The triggered burst and its context
 * @returns Updated MatchState with burst effects applied
 *
 * @see GAME_DESIGN.md §8.3
 */
export function applyBurstEffect(
  match: MatchState,
  triggered: TriggeredBurst,
): MatchState {
  const activePlayer = match.players.find((p) => p.playerId === match.activePlayerId);
  const opponent = match.players.find((p) => p.playerId !== match.activePlayerId);
  if (!activePlayer || !opponent) return match;

  let updatedMatch = { ...match };

  switch (triggered.burst.name) {
    case 'Court of Desire':
      // +3 CE to active player
      updatedMatch = {
        ...updatedMatch,
        players: updatedMatch.players.map((p) => {
          if (p.playerId !== activePlayer.playerId) return p;
          return { ...p, celestialEnergy: Math.min(7, p.celestialEnergy + 3) };
        }),
      };
      break;

    case 'Harmonic Proof':
      // All council figures +5 Transit Power
      updatedMatch = {
        ...updatedMatch,
        players: updatedMatch.players.map((p) => {
          if (p.playerId !== activePlayer.playerId) return p;
          return {
            ...p,
            battlefield: p.battlefield.map((card) => ({
              ...card,
              transitPower: Math.min(100, card.transitPower + 5),
            })),
          };
        }),
      };
      break;

    case 'The Burning Word': {
      // All bonds generate 5 CE total (GDD §8.3: "5 total" regardless of individual bond counts)
      // requiredActiveBonds: 2 ensures bonds exist before this triggers
      const burstCE = 5;
      updatedMatch = {
        ...updatedMatch,
        players: updatedMatch.players.map((p) => {
          if (p.playerId !== activePlayer.playerId) return p;
          return { ...p, celestialEnergy: Math.min(7, p.celestialEnergy + burstCE) };
        }),
      };
      break;
    }

    case 'Silent Authority': {
      // Opponent Transit Clock frozen for 1 turn — mark via a special flag in cosmos
      // For Phase 0: we reduce the opponent's Transit Clock tick for this turn
      // (The pass phase will still add +1, effectively a freeze)
      const opponentId = opponent.playerId;
      updatedMatch = {
        ...updatedMatch,
        transitClocks: {
          ...updatedMatch.transitClocks,
          // Pre-subtract 1 so the end-of-turn +1 results in no net change
          [opponentId]: Math.max(0, (updatedMatch.transitClocks[opponentId] ?? 0) - 1),
        },
      };
      break;
    }

    // Logos Barrier and Eternal March effects are tracked by the caller
    // (they modify combat resolution, not just match state)
    default:
      break;
  }

  return updatedMatch;
}
