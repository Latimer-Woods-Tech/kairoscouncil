/**
 * @module transit-clock.test
 * Unit tests for Transit Clock management and win conditions.
 */

import { describe, it, expect } from 'vitest';
import { checkWinConditions, computeClockEvents, applyClockReckoning } from '../../src/clock/transit-clock.js';
import type { MatchState, CardInstance, HistoricalFigure } from '@kairos/shared';

// ── Helpers ───────────────────────────────────────────────────────────────────

function minimalMatchState(overrides: Partial<MatchState> = {}): MatchState {
  return {
    matchId: 'test-match',
    mode: 'transit',
    seed: 42n,
    seedTimestamp: new Date('2024-01-01'),
    turn: 5,
    activePlayerId: 'player1',
    players: [
      {
        playerId: 'player1',
        deck: [],
        hand: [],
        battlefield: [],
        suppressedZone: [],
        councilLeaderId: 'leader1',
        celestialEnergy: 3,
        carryoverCE: 0,
      },
      {
        playerId: 'player2',
        deck: [],
        hand: [],
        battlefield: [],
        suppressedZone: [],
        councilLeaderId: 'leader2',
        celestialEnergy: 3,
        carryoverCE: 0,
      },
    ],
    cosmosSnapshot: {
      timestamp: new Date(),
      activeEvents: [],
      forecast: [],
    },
    transitClocks: { player1: 5, player2: 5 },
    ...overrides,
  };
}

function mockAscendantCard(id: string): CardInstance {
  return {
    figureId: id,
    figure: {
      id,
      name: id,
      birthDate: new Date(),
      birthDatePrecision: 'verified',
      archetypeSchool: 'Warrior',
      primaryForge: 'Phoenix',
      rulingPlanet: 'Mars',
      natalAspects: [],
      era: 'Test',
    } as HistoricalFigure,
    transitPower: 75,
    state: 'Ascendant',
    forgeIntensity: { primary: 2, secondary: null },
    activeAspectBonds: [],
    phoenixRebornTurns: 0,
    dormantActionUsed: false,
  };
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('checkWinConditions', () => {
  it('returns null winner when no one has reached 13', () => {
    const match = minimalMatchState({ transitClocks: { player1: 10, player2: 9 } });
    const result = checkWinConditions(match, 'player2');
    expect(result.winner).toBeNull();
  });

  it('returns the player who reached 13 first', () => {
    const match = minimalMatchState({ transitClocks: { player1: 13, player2: 10 } });
    const result = checkWinConditions(match, 'player2');
    expect(result.winner).toBe('player1');
    expect(result.wasTiebreak).toBe(false);
  });

  it('uses Council Leader TP for simultaneous win tiebreak', () => {
    const leaderCard = { ...mockAscendantCard('leader1'), transitPower: 85 };
    const leaderCard2 = { ...mockAscendantCard('leader2'), transitPower: 72 };

    const match = minimalMatchState({
      transitClocks: { player1: 13, player2: 13 },
      players: [
        { ...(minimalMatchState().players[0]!), battlefield: [leaderCard] },
        { ...(minimalMatchState().players[1]!), battlefield: [leaderCard2] },
      ],
    });
    const result = checkWinConditions(match, 'player2');
    expect(result.winner).toBe('player1'); // higher leader TP
    expect(result.wasTiebreak).toBe(true);
  });

  it('second player wins when both CL TP are equal', () => {
    const leaderCard = { ...mockAscendantCard('leader1'), transitPower: 75 };
    const leaderCard2 = { ...mockAscendantCard('leader2'), transitPower: 75 };

    const match = minimalMatchState({
      transitClocks: { player1: 13, player2: 13 },
      players: [
        { ...(minimalMatchState().players[0]!), battlefield: [leaderCard] },
        { ...(minimalMatchState().players[1]!), battlefield: [leaderCard2] },
      ],
    });
    const result = checkWinConditions(match, 'player2');
    expect(result.winner).toBe('player2'); // going-second advantage
    expect(result.wasTiebreak).toBe(true);
  });
});

describe('computeClockEvents', () => {
  it('includes turn_end event with +1', () => {
    const match = minimalMatchState({ transitClocks: { player1: 5, player2: 5 } });
    const result = computeClockEvents(match, 'player1', 0, 0);
    expect(result.events).toContain('turn_end');
    expect(result.netChange).toBeGreaterThanOrEqual(1);
    expect(result.newClock).toBeGreaterThanOrEqual(6);
  });

  it('adds triple_ascendant event with 3+ Ascendant figures', () => {
    const cards = ['f1', 'f2', 'f3'].map(mockAscendantCard);
    const match = minimalMatchState();
    match.players[0]!.battlefield = cards;
    match.transitClocks = { player1: 5, player2: 5 };

    const result = computeClockEvents(match, 'player1', 0, 0);
    expect(result.events).toContain('triple_ascendant');
    expect(result.netChange).toBe(2); // +1 turn_end +1 triple_ascendant
  });

  it('subtracts for all_dormant condition', () => {
    const dormantCard: CardInstance = { ...mockAscendantCard('f1'), state: 'Dormant' };
    const match = minimalMatchState();
    match.players[0]!.battlefield = [dormantCard];
    match.transitClocks = { player1: 5, player2: 5 };

    const result = computeClockEvents(match, 'player1', 0, 0);
    expect(result.events).toContain('all_dormant');
    // +1 turn_end, -1 all_dormant = net 0, but minimum 0
  });
});
