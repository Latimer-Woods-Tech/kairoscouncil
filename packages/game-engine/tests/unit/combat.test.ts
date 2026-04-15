/**
 * @module combat.test
 * Unit tests for combat damage calculation — AC-005 compliance.
 */

import { describe, it, expect } from 'vitest';
import {
  getForgeMatchup,
  calculateAttackDamage,
  getEffectiveTransitPower,
} from '../../src/combat/damage.js';
import type { CardInstance, HistoricalFigure } from '@kairos/shared';
import { SeededRandom } from '../../src/seed/seed.js';

// ── Helpers ───────────────────────────────────────────────────────────────────

function mockFigure(id: string, forge: HistoricalFigure['primaryForge']): HistoricalFigure {
  return {
    id,
    name: id,
    birthDate: new Date('1769-08-15'),
    birthDatePrecision: 'verified',
    archetypeSchool: 'Warrior',
    primaryForge: forge,
    rulingPlanet: 'Mars',
    natalAspects: [],
    era: 'Test',
  };
}

function mockCard(
  id: string,
  forge: HistoricalFigure['primaryForge'],
  transitPower: number,
  state: CardInstance['state'] = 'Ascendant',
  forgeIntensity: 1 | 2 | 3 = 1,
): CardInstance {
  return {
    figureId: id,
    figure: mockFigure(id, forge),
    transitPower,
    state,
    forgeIntensity: { primary: forgeIntensity, secondary: null },
    activeAspectBonds: [],
    phoenixRebornTurns: 0,
    dormantActionUsed: false,
  };
}

const rng = new SeededRandom(42n);

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('getForgeMatchup — AC-006 Forge Matrix', () => {
  it('Chronos vs Lux = weak', () => {
    expect(getForgeMatchup('Chronos', 'Lux')).toBe('weak');
  });
  it('Chronos vs Phoenix = strong', () => {
    expect(getForgeMatchup('Chronos', 'Phoenix')).toBe('strong');
  });
  it('Phoenix vs Eros = strong', () => {
    expect(getForgeMatchup('Phoenix', 'Eros')).toBe('strong');
  });
  it('Phoenix vs Aether = weak', () => {
    expect(getForgeMatchup('Phoenix', 'Aether')).toBe('weak');
  });
  it('Phoenix vs Phoenix = neutral', () => {
    expect(getForgeMatchup('Phoenix', 'Phoenix')).toBe('neutral');
  });
});

describe('calculateAttackDamage — AC-005', () => {
  it('computes basic damage: TP × Intensity × matchup modifier', () => {
    // Napoleon (TP 78, Phoenix Forge Intensity 2) vs neutral
    const attacker = mockCard('napoleon', 'Phoenix', 78, 'Ascendant', 2);
    const defender = mockCard('hypatia', 'Aether', 95);

    const result = calculateAttackDamage(attacker, defender, 'Phoenix', rng);

    // Phoenix vs Aether = weak (0.9×)
    expect(result.damage).toBe(Math.floor(78 * 2 * 0.9)); // 140
    expect(result.forgeMatchup).toBe('weak');
    expect(result.matchupModifier).toBe(0.9);
    expect(result.forgeIntensity).toBe(2);
  });

  it('strong matchup: 1.1× modifier', () => {
    const attacker = mockCard('napoleon', 'Phoenix', 78, 'Ascendant', 2);
    const defender = mockCard('rumi', 'Eros', 60);

    const result = calculateAttackDamage(attacker, defender, 'Phoenix', rng);

    // Phoenix vs Eros = strong (1.1×)
    expect(result.damage).toBe(Math.floor(78 * 2 * 1.1)); // 171
    expect(result.forgeMatchup).toBe('strong');
  });

  it('marks suppressed when damage >= defender TP (Ascendant)', () => {
    const attacker = mockCard('caesar', 'Lux', 78, 'Ascendant', 2);
    const defender = mockCard('hannibal', 'Phoenix', 60);

    const result = calculateAttackDamage(attacker, defender, 'Lux', rng);
    // Lux vs Phoenix = weak (0.9)
    // damage = floor(78 * 2 * 0.9) = 140
    // defender TP = 60 → 140 >= 60 → suppressed
    expect(result.targetSuppressed).toBe(true);
  });

  it('marks NOT suppressed when damage < defender TP', () => {
    const attacker = mockCard('rumi', 'Eros', 45, 'Ascendant', 1);
    const defender = mockCard('caesar', 'Lux', 99);

    const result = calculateAttackDamage(attacker, defender, 'Eros', rng);
    // Eros vs Lux = neutral (1.0)
    // damage = floor(45 * 1 * 1.0) = 45
    // defender TP = 99 → 45 < 99 → not suppressed
    expect(result.targetSuppressed).toBe(false);
  });

  it('Dormant defender uses TP × 0.5 as suppression threshold', () => {
    const attacker = mockCard('napoleon', 'Phoenix', 78, 'Ascendant', 1);
    const defender = mockCard('hypatia', 'Aether', 90, 'Dormant');

    const result = calculateAttackDamage(attacker, defender, 'Phoenix', rng);
    // Phoenix vs Aether = weak (0.9)
    // damage = floor(78 * 1 * 0.9) = 70
    // dormant threshold = 90 * 0.5 = 45
    // 70 >= 45 → suppressed
    expect(result.targetSuppressed).toBe(true);
  });

  it('throws KairosError KC-2006 when attacker is Dormant', () => {
    const attacker = mockCard('dormant-figure', 'Phoenix', 55, 'Dormant');
    const defender = mockCard('defender', 'Aether', 80);

    expect(() =>
      calculateAttackDamage(attacker, defender, 'Phoenix', rng),
    ).toThrow();
  });
});

describe('getEffectiveTransitPower', () => {
  it('returns card transitPower when no active bonds', () => {
    const card = mockCard('napoleon', 'Phoenix', 78);
    expect(getEffectiveTransitPower(card, true)).toBe(78);
  });

  it('adds bond bonuses to effective TP', () => {
    const card: CardInstance = {
      ...mockCard('napoleon', 'Phoenix', 78),
      activeAspectBonds: [
        {
          figure1Id: 'napoleon',
          figure2Id: 'caesar',
          aspectType: 'conjunction',
          effect: { transitPowerBonus1: 15, transitPowerBonus2: 15, bonusCE: 0 },
          chronosDelayCount: 0,
          isActive: true,
        },
      ],
    };
    expect(getEffectiveTransitPower(card, true)).toBe(93); // 78 + 15
  });

  it('caps effective TP at 100', () => {
    const card: CardInstance = {
      ...mockCard('napoleon', 'Phoenix', 92),
      activeAspectBonds: [
        {
          figure1Id: 'napoleon',
          figure2Id: 'caesar',
          aspectType: 'conjunction',
          effect: { transitPowerBonus1: 15, transitPowerBonus2: 15, bonusCE: 0 },
          chronosDelayCount: 0,
          isActive: true,
        },
      ],
    };
    expect(getEffectiveTransitPower(card, true)).toBe(100); // 92 + 15 capped at 100
  });
});
