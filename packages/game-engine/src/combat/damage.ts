/**
 * @module @kairos/game-engine/combat/damage
 * Combat damage calculation, suppression, and Dormant figure actions.
 *
 * AC-005: Attack Damage = Transit Power × Forge Intensity × Forge Matchup Modifier
 *         Suppression: Damage ≥ target Transit Power
 *         Dormant threshold: TP × 0.5
 *
 * AC-006: Forge Interaction Matrix — Strong 1.1× | Neutral 1.0× | Weak 0.9×
 *
 * @see GAME_DESIGN.md §4.2 Combat Damage
 */

import type {
  MatchState,
  CardInstance,
  AttackAction,
  AttackResult,
  ForgeSchool,
} from '@kairos/shared';
import {
  KairosError,
  ErrorCode,
  FORGE_MATRIX,
  FORGE_MATCHUP_MODIFIERS,
  DORMANT_SUPPRESSION_MULTIPLIER,
  DORMANT_SUPPORT_TP_BONUS,
  DORMANT_SUPPORT_FI_BONUS,
  TRANSIT_POWER_CEILING,
  SQUARE_MISFIRE_CHANCE,
} from '@kairos/shared';
import type { SeededRandom } from '../seed/seed.js';

/**
 * Determines the Forge matchup between attacker and defender Forge schools.
 * Reads from the FORGE_MATRIX constant (AC-006).
 *
 * @param attackerForge - Forge school of the attacking figure
 * @param defenderForge - Forge school of the defending figure
 * @returns 'strong', 'neutral', or 'weak'
 *
 * @see AC-006 — Forge Interaction Matrix
 */
export function getForgeMatchup(attackerForge: ForgeSchool, defenderForge: ForgeSchool): 'strong' | 'neutral' | 'weak' {
  return FORGE_MATRIX[attackerForge][defenderForge];
}

/**
 * Calculates the Aspect Bonus from active aspect bonds.
 * Each active bond contributes its TP bonus to the figure's total.
 * Capped to ensure combined TP stays within [40, 100].
 *
 * @param card - Card instance with active bonds
 * @param asAttacker - true to use attacker bonuses, false for defender bonuses
 * @returns Aspect bonus points from active bonds (0–20 as per AC-004)
 */
export function calculateAspectBonus(card: CardInstance, asAttacker: boolean): number {
  let bonus = 0;
  for (const bond of card.activeAspectBonds) {
    if (!bond.isActive) continue;
    // figure1 is always the one who "owns" the bond reference in their array
    bonus += asAttacker
      ? bond.effect.transitPowerBonus1
      : bond.effect.transitPowerBonus2;
  }
  return bonus;
}

/**
 * Computes the effective Transit Power for combat, including active bond bonuses.
 *
 * @param card - Card instance
 * @param asAttacker - Whether this figure is attacking (vs defending)
 * @returns Effective TP for combat resolution (may temporarily exceed 100 for attackers)
 */
export function getEffectiveTransitPower(card: CardInstance, asAttacker: boolean): number {
  const aspectBonus = calculateAspectBonus(card, asAttacker);
  return Math.min(TRANSIT_POWER_CEILING, card.transitPower + aspectBonus);
}

/**
 * Calculates attack damage per AC-005.
 *
 * Formula: damage = TP × forgeIntensity × matchupModifier
 *
 * @param attacker - Attacking card instance
 * @param defender - Defending card instance
 * @param attackForge - Forge school being used for the attack
 * @param rng - Seeded RNG for Square bond misfire check (AC-003)
 * @returns AttackResult with damage, modifiers, and suppression flags
 *
 * @example
 * // Napoleon (TP 78) attacks with Phoenix (Intensity 2) vs Hypatia (Aether)
 * // Phoenix vs Aether = weak (0.9×)
 * // Damage = 78 × 2 × 0.9 = 140.4 → rounded down = 140
 *
 * @see AC-005 — Attack Damage Formula
 * @see AC-006 — Forge Interaction Matrix
 */
export function calculateAttackDamage(
  attacker: CardInstance,
  defender: CardInstance,
  attackForge: ForgeSchool,
  rng: SeededRandom,
): AttackResult {
  if (attacker.state !== 'Ascendant') {
    throw new KairosError(
      ErrorCode.FIGURE_NOT_ASCENDANT,
      `Figure ${attacker.figureId} must be Ascendant to attack`,
      { figureId: attacker.figureId, state: attacker.state },
    );
  }

  const attackerTP = getEffectiveTransitPower(attacker, true);
  const defenderTP = getEffectiveTransitPower(defender, false);
  const intensity = attacker.forgeIntensity.primary;
  const matchup = getForgeMatchup(attackForge, defender.figure.primaryForge);
  const matchupModifier = FORGE_MATCHUP_MODIFIERS[matchup];

  // Raw damage (AC-005)
  const damage = Math.floor(attackerTP * intensity * matchupModifier);

  // Suppression threshold depends on defender state (AC-005)
  const suppressionThreshold = defender.state === 'Dormant'
    ? Math.floor(defenderTP * DORMANT_SUPPRESSION_MULTIPLIER)
    : defenderTP;

  const targetSuppressed = damage >= suppressionThreshold;

  // Square bond misfire check (AC-003: deterministic)
  let squareMisfired = false;
  let misfireTargetId: string | undefined;

  const squareBond = attacker.activeAspectBonds.find(
    (b) => b.isActive && b.aspectType === 'square',
  );
  if (squareBond) {
    squareMisfired = rng.nextBool(SQUARE_MISFIRE_CHANCE);
    if (squareMisfired) {
      misfireTargetId = squareBond.figure2Id;
    }
  }

  return {
    damage,
    transitPower: attackerTP,
    forgeIntensity: intensity,
    forgeMatchup: matchup,
    matchupModifier,
    targetSuppressed,
    squareMisfired,
    misfireTargetId,
  };
}

/**
 * Resolves an attack action against the match state.
 * Updates attacker/defender states, applies suppression.
 *
 * @param match - Current match state
 * @param action - Attack action (attacker, target, forge school)
 * @param rng - Seeded RNG for stochastic elements (AC-003)
 * @returns { updatedMatch, result }
 *
 * @see AC-005 — Attack Damage Formula
 */
export function resolveAttack(
  match: MatchState,
  action: AttackAction,
  rng: SeededRandom,
): { match: MatchState; result: AttackResult } {
  const activePlayer = match.players.find((p) => p.playerId === match.activePlayerId);
  const opponent = match.players.find((p) => p.playerId !== match.activePlayerId);

  if (!activePlayer || !opponent) {
    throw new KairosError(ErrorCode.INVALID_MATCH_STATE, 'Could not find players', { matchId: match.matchId });
  }

  const attacker = activePlayer.battlefield.find((c) => c.figureId === action.attackerId);
  const target = opponent.battlefield.find((c) => c.figureId === action.targetId);

  if (!attacker) {
    throw new KairosError(
      ErrorCode.ILLEGAL_GAME_ACTION,
      `Attacker ${action.attackerId} not found on active player's battlefield`,
      { attackerId: action.attackerId },
    );
  }
  if (!target) {
    throw new KairosError(
      ErrorCode.ILLEGAL_GAME_ACTION,
      `Target ${action.targetId} not found on opponent's battlefield`,
      { targetId: action.targetId },
    );
  }

  const result = calculateAttackDamage(attacker, target, action.forgeSchool, rng);

  // Resolve actual target (misfire may redirect to attacker's ally)
  let resolvedTargetId = action.targetId;
  let resolvedOpponentId = opponent.playerId;

  if (result.squareMisfired && result.misfireTargetId) {
    resolvedTargetId = result.misfireTargetId;
    resolvedOpponentId = activePlayer.playerId; // misfire hits own battlefield
  }

  // Apply suppression to the resolved target
  const updatedMatch: MatchState = {
    ...match,
    players: match.players.map((player) => {
      if (player.playerId !== resolvedOpponentId && player.playerId !== opponent.playerId) {
        return player;
      }
      // Find and update the target figure
      const isTargetPlayer = player.playerId === resolvedOpponentId;
      if (!isTargetPlayer) return player;

      return {
        ...player,
        battlefield: player.battlefield
          .map((card) => {
            if (card.figureId !== resolvedTargetId) return card;
            if (!result.targetSuppressed) return card;
            // Move to Suppressed state
            return { ...card, state: 'Suppressed' as const };
          })
          .filter((card) => card.state !== 'Suppressed'),
        suppressedZone: [
          ...player.suppressedZone,
          ...player.battlefield
            .filter((c) => c.figureId === resolvedTargetId && result.targetSuppressed)
            .map((c) => ({ ...c, state: 'Suppressed' as const })),
        ],
      };
    }),
  };

  return { match: updatedMatch, result };
}

/**
 * Processes a Dormant figure's action for the turn.
 * A Dormant figure may choose one of:
 *   a) Generate 1 CE for controller
 *   b) Apply support to one allied Ascendant figure (+5 TP or +1 Forge Intensity)
 *
 * @param match - Current match state
 * @param playerId - Player performing the dormant action
 * @param dormantFigureId - The Dormant figure using its action
 * @param action - 'generateCE' | 'supportTP' | 'supportFI'
 * @param targetFigureId - Required for 'supportTP' and 'supportFI'
 * @returns Updated MatchState
 *
 * @see GAME_DESIGN.md §7.5 Figure States (Dormant Actions)
 */
export function processDormantAction(
  match: MatchState,
  playerId: string,
  dormantFigureId: string,
  action: 'generateCE' | 'supportTP' | 'supportFI',
  targetFigureId?: string,
): MatchState {
  const player = match.players.find((p) => p.playerId === playerId);
  if (!player) {
    throw new KairosError(ErrorCode.INVALID_MATCH_STATE, `Player ${playerId} not found`);
  }

  const dormant = player.battlefield.find((c) => c.figureId === dormantFigureId);
  if (!dormant || dormant.state !== 'Dormant') {
    throw new KairosError(
      ErrorCode.ILLEGAL_GAME_ACTION,
      `Figure ${dormantFigureId} is not Dormant`,
      { figureId: dormantFigureId },
    );
  }
  if (dormant.dormantActionUsed) {
    throw new KairosError(
      ErrorCode.ILLEGAL_GAME_ACTION,
      `Figure ${dormantFigureId} has already used its Dormant action this turn`,
    );
  }

  return {
    ...match,
    players: match.players.map((p) => {
      if (p.playerId !== playerId) return p;

      // Mark the dormant figure as having used its action
      const updatedBattlefield = p.battlefield.map((card) => {
        if (card.figureId === dormantFigureId) {
          return { ...card, dormantActionUsed: true };
        }
        // Apply support if targeting an ally
        if (
          action === 'supportTP' &&
          targetFigureId &&
          card.figureId === targetFigureId &&
          card.state === 'Ascendant'
        ) {
          return {
            ...card,
            transitPower: Math.min(TRANSIT_POWER_CEILING, card.transitPower + DORMANT_SUPPORT_TP_BONUS),
          };
        }
        if (
          action === 'supportFI' &&
          targetFigureId &&
          card.figureId === targetFigureId &&
          card.state === 'Ascendant'
        ) {
          const newPrimaryFI = Math.min(3, card.forgeIntensity.primary + DORMANT_SUPPORT_FI_BONUS) as 1 | 2 | 3;
          return { ...card, forgeIntensity: { ...card.forgeIntensity, primary: newPrimaryFI } };
        }
        return card;
      });

      const ceGain = action === 'generateCE' ? 1 : 0;
      return {
        ...p,
        battlefield: updatedBattlefield,
        celestialEnergy: Math.min(p.celestialEnergy + ceGain, 7),
      };
    }),
  };
}

/**
 * Processes a Phoenix self-immolation action.
 * The figure voluntarily enters Suppression, then returns next turn at TP 55 (Ascendant).
 *
 * @param match - Current match state
 * @param playerId - Player who owns the Phoenix figure
 * @param figureId - Phoenix figure to immolate
 * @returns Updated MatchState with figure in Suppressed zone, flagged for return
 *
 * @see GAME_DESIGN.md §7.7 Phoenix Self-Immolation
 */
export function processPhoenixImmolation(
  match: MatchState,
  playerId: string,
  figureId: string,
): MatchState {
  const player = match.players.find((p) => p.playerId === playerId);
  if (!player) {
    throw new KairosError(ErrorCode.INVALID_MATCH_STATE, `Player ${playerId} not found`);
  }

  const figure = player.battlefield.find((c) => c.figureId === figureId);
  if (!figure) {
    throw new KairosError(
      ErrorCode.ILLEGAL_GAME_ACTION,
      `Figure ${figureId} not on battlefield`,
    );
  }

  return {
    ...match,
    players: match.players.map((p) => {
      if (p.playerId !== playerId) return p;
      return {
        ...p,
        battlefield: p.battlefield.filter((c) => c.figureId !== figureId),
        suppressedZone: [
          ...p.suppressedZone,
          {
            ...figure,
            state: 'Suppressed' as const,
            // phoenixRebornTurns = 1 means "return next turn"
            phoenixRebornTurns: 1,
          },
        ],
      };
    }),
  };
}

/**
 * Processes Phoenix returns at the start of a turn.
 * Figures with phoenixRebornTurns > 0 return at Floor+15 = 55, always Ascendant.
 * Phoenix Reborn: immune to Eros/Aether for 2 turns.
 *
 * @param match - Current match state (beginning of a turn)
 * @param playerId - Player whose Phoenix figures may return
 * @returns Updated MatchState
 *
 * @see GAME_DESIGN.md §7.7
 * @see PHOENIX_RETURN_BONUS constant in @kairos/shared
 */
export function processPhoenixReturns(match: MatchState, playerId: string): MatchState {
  const PHOENIX_RETURN_POWER = 55; // TRANSIT_POWER_FLOOR + PHOENIX_RETURN_BONUS = 40 + 15

  return {
    ...match,
    players: match.players.map((p) => {
      if (p.playerId !== playerId) return p;

      const returning: CardInstance[] = [];
      const stillSuppressed: CardInstance[] = [];

      for (const card of p.suppressedZone) {
        if (card.phoenixRebornTurns === 1) {
          // Returns this turn
          returning.push({
            ...card,
            transitPower: PHOENIX_RETURN_POWER,
            state: 'Ascendant' as const,
            phoenixRebornTurns: 2, // 2 turns of Phoenix Reborn immunity
          });
        } else if (card.phoenixRebornTurns > 1) {
          // Decrement immunity counter
          stillSuppressed.push({ ...card, phoenixRebornTurns: card.phoenixRebornTurns - 1 });
        } else {
          stillSuppressed.push(card);
        }
      }

      return {
        ...p,
        suppressedZone: stillSuppressed,
        battlefield: [...p.battlefield, ...returning],
      };
    }),
  };
}
