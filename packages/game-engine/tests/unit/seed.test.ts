/**
 * @module seed.test
 * Unit tests for the deterministic seed system — AC-003 compliance.
 */

import { describe, it, expect } from 'vitest';
import { SeededRandom, generateMatchSeed } from '../../src/seed/seed.js';

describe('SeededRandom — AC-003 deterministic PRNG', () => {
  describe('determinism', () => {
    it('produces the same sequence for the same seed', () => {
      const rng1 = new SeededRandom(12345n);
      const rng2 = new SeededRandom(12345n);
      for (let i = 0; i < 10; i++) {
        expect(rng1.next()).toBe(rng2.next());
      }
    });

    it('produces different sequences for different seeds', () => {
      const rng1 = new SeededRandom(12345n);
      const rng2 = new SeededRandom(99999n);
      const values1 = Array.from({ length: 5 }, () => rng1.next());
      const values2 = Array.from({ length: 5 }, () => rng2.next());
      expect(values1).not.toEqual(values2);
    });
  });

  describe('range', () => {
    it('next() always returns value in [0, 1)', () => {
      const rng = new SeededRandom(42n);
      for (let i = 0; i < 100; i++) {
        const v = rng.next();
        expect(v).toBeGreaterThanOrEqual(0);
        expect(v).toBeLessThan(1);
      }
    });

    it('nextInt(min, max) returns integer in [min, max]', () => {
      const rng = new SeededRandom(42n);
      for (let i = 0; i < 100; i++) {
        const v = rng.nextInt(1, 6);
        expect(v).toBeGreaterThanOrEqual(1);
        expect(v).toBeLessThanOrEqual(6);
        expect(Number.isInteger(v)).toBe(true);
      }
    });

    it('nextBool(0.3) fires at approximately 30% of the time', () => {
      const rng = new SeededRandom(99887766n);
      let trueCount = 0;
      const N = 10000;
      for (let i = 0; i < N; i++) {
        if (rng.nextBool(0.3)) trueCount++;
      }
      // Expect within 5% of 30%
      expect(trueCount / N).toBeGreaterThan(0.25);
      expect(trueCount / N).toBeLessThan(0.35);
    });
  });

  describe('shuffle', () => {
    it('preserves all elements', () => {
      const rng = new SeededRandom(55555n);
      const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
      const shuffled = rng.shuffle(arr);
      expect(shuffled).toHaveLength(arr.length);
      expect(shuffled.sort((a, b) => a - b)).toEqual(arr);
    });

    it('produces deterministic shuffle for same seed', () => {
      const arr = ['a', 'b', 'c', 'd', 'e'];
      const rng1 = new SeededRandom(777n);
      const rng2 = new SeededRandom(777n);
      expect(rng1.shuffle(arr)).toEqual(rng2.shuffle(arr));
    });

    it('does not mutate the original array', () => {
      const rng = new SeededRandom(123n);
      const arr = [1, 2, 3, 4, 5];
      const original = [...arr];
      rng.shuffle(arr);
      expect(arr).toEqual(original);
    });
  });

  describe('error handling', () => {
    it('throws KairosError KC-2002 for zero seed', () => {
      expect(() => new SeededRandom(0n)).toThrow();
    });
  });
});

describe('generateMatchSeed — AC-003', () => {
  it('generates non-zero seed', () => {
    const seed = generateMatchSeed(new Date('2024-01-15T12:00:00Z'), 'player1player2');
    expect(seed).not.toBe(0n);
    expect(typeof seed).toBe('bigint');
  });

  it('produces different seeds for different timestamps', () => {
    const seed1 = generateMatchSeed(new Date('2024-01-15T12:00:00Z'), 'abc');
    const seed2 = generateMatchSeed(new Date('2024-01-15T12:00:01Z'), 'abc');
    expect(seed1).not.toBe(seed2);
  });

  it('produces different seeds for different salts', () => {
    const ts = new Date('2024-01-15T12:00:00Z');
    const seed1 = generateMatchSeed(ts, 'player1player2');
    const seed2 = generateMatchSeed(ts, 'player3player4');
    expect(seed1).not.toBe(seed2);
  });

  it('is deterministic for same inputs', () => {
    const ts = new Date('2024-06-21T15:30:00Z');
    const salt = 'test-match-salt';
    expect(generateMatchSeed(ts, salt)).toBe(generateMatchSeed(ts, salt));
  });
});
