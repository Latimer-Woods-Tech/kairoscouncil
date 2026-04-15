import { describe, it, expect } from 'vitest';
import { detectAspects, getAspectType, calculateOrbAndExactness } from '../../src/core/aspects.js';
import type { PlanetaryPosition } from '@kairos/shared';
import { MAX_ASPECT_ORB } from '@kairos/shared';

/** Helper: build a minimal PlanetaryPosition fixture */
function makePosition(planet: PlanetaryPosition['planet'], longitude: number): PlanetaryPosition {
  return {
    planet,
    longitude,
    latitude: 0,
    sign: 'Aries',
    degree: longitude % 30,
    isRetrograde: false,
    dignity: 'peregrine',
  };
}

describe('Aspect Type Detection', () => {
  it('0° separation → conjunction', () => {
    expect(getAspectType(0)).toBe('conjunction');
  });

  it('180° separation → opposition', () => {
    expect(getAspectType(180)).toBe('opposition');
  });

  it('120° separation → trine', () => {
    expect(getAspectType(120)).toBe('trine');
  });

  it('90° separation → square', () => {
    expect(getAspectType(90)).toBe('square');
  });

  it('60° separation → sextile', () => {
    expect(getAspectType(60)).toBe('sextile');
  });

  it('45° separation → null (no aspect)', () => {
    expect(getAspectType(45)).toBeNull();
  });

  it('2.9° separation → conjunction (within 3° orb)', () => {
    expect(getAspectType(2.9)).toBe('conjunction');
  });

  it('3.1° separation → null (outside 3° orb)', () => {
    expect(getAspectType(3.1)).toBeNull();
  });

  it('Handles retrograde-style wrap: 359° separation is 1° conjunction', () => {
    expect(getAspectType(359)).toBe('conjunction');
  });
});

describe('Orb and Exactness Score', () => {
  it('Exactness score is 10 at 0° orb (exact)', () => {
    const { orb, exactnessScore } = calculateOrbAndExactness(0, 'conjunction');
    expect(orb).toBeCloseTo(0, 2);
    expect(exactnessScore).toBeCloseTo(10, 1);
  });

  it('Exactness score is 0 at 3° orb', () => {
    const { exactnessScore } = calculateOrbAndExactness(MAX_ASPECT_ORB, 'conjunction');
    expect(exactnessScore).toBeCloseTo(0, 1);
  });

  it('Exactness score is 5 at 1.5° orb (midpoint)', () => {
    const { exactnessScore } = calculateOrbAndExactness(1.5, 'conjunction');
    expect(exactnessScore).toBeCloseTo(5, 0);
  });

  it('Exactness score is linear between 0 and MAX_ASPECT_ORB', () => {
    const { exactnessScore: s1 } = calculateOrbAndExactness(1, 'conjunction');
    const { exactnessScore: s2 } = calculateOrbAndExactness(2, 'conjunction');
    // s1 should be ~6.67, s2 should be ~3.33
    expect(s1).toBeGreaterThan(s2);
    expect(s1 + s2).toBeCloseTo(10, 0);
  });
});

describe('Detect Aspects between Positions', () => {
  it('Conjunction at 0° is detected', () => {
    const sun = makePosition('Sun', 143);    // Leo 23°
    const mars = makePosition('Mars', 143);  // exact conjunction
    const aspects = detectAspects([sun, mars]);
    expect(aspects).toHaveLength(1);
    expect(aspects[0]?.type).toBe('conjunction');
    expect(aspects[0]?.currentOrb).toBeCloseTo(0, 2);
  });

  it('Opposition at 180° is detected', () => {
    const sun = makePosition('Sun', 0);
    const jupiter = makePosition('Jupiter', 180);
    const aspects = detectAspects([sun, jupiter]);
    expect(aspects[0]?.type).toBe('opposition');
  });

  it('Trine at 120° is detected', () => {
    const sun = makePosition('Sun', 0);
    const moon = makePosition('Moon', 120);
    const aspects = detectAspects([sun, moon]);
    expect(aspects[0]?.type).toBe('trine');
  });

  it('Near-exact aspect at 0.4° orb is detected', () => {
    // Napoleon test setup: Mars conjunct Sun at 0.4°
    const sun = makePosition('Sun', 143.0);
    const mars = makePosition('Mars', 143.4);
    const aspects = detectAspects([sun, mars]);
    expect(aspects).toHaveLength(1);
    expect(aspects[0]?.type).toBe('conjunction');
    expect(aspects[0]?.currentOrb).toBeCloseTo(0.4, 1);
    expect(aspects[0]?.exactnessScore).toBeGreaterThan(8.5);
  });

  it('No aspect for 45° separation', () => {
    const sun = makePosition('Sun', 0);
    const mercury = makePosition('Mercury', 45);
    const aspects = detectAspects([sun, mercury]);
    expect(aspects).toHaveLength(0);
  });

  it('Outside 3° orb — no conjunction detected', () => {
    const sun = makePosition('Sun', 0);
    const mars = makePosition('Mars', 3.5);
    const aspects = detectAspects([sun, mars]);
    expect(aspects).toHaveLength(0);
  });

  it('Detects multiple aspects among 3+ planets', () => {
    const p1 = makePosition('Sun', 0);
    const p2 = makePosition('Moon', 120);   // trine to p1
    const p3 = makePosition('Mars', 240);   // trine to p1, trine to p2
    const aspects = detectAspects([p1, p2, p3]);
    // p1-p2 trine, p1-p3 trine, p2-p3 trine (or square ~120° between them)
    // p2 at 120, p3 at 240, diff = 120 → trine
    expect(aspects.length).toBeGreaterThanOrEqual(2);
  });
});
