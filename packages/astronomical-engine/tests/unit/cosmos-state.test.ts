import { describe, it, expect } from 'vitest';
import { computeNatalChart } from '../../src/core/natal-chart.js';
import { computeCosmosState } from '../../src/core/cosmos-state.js';
import { dateToJDE } from '../../src/core/julian-date.js';

describe('Natal Chart Computation', () => {
  it('Napoleon natal chart: Sun in Leo', () => {
    const birthJDE = dateToJDE(1769, 8, 15, true);
    const chart = computeNatalChart({ jde: birthJDE, timeKnown: false });
    const sun = chart.planetaryPositions.find((p) => p.planet === 'Sun');
    expect(sun).toBeDefined();
    expect(sun!.sign).toBe('Leo');
    // Leo 23° ≈ 143°
    expect(sun!.longitude).toBeGreaterThan(140);
    expect(sun!.longitude).toBeLessThan(147);
  });

  it('Natal chart has all 10 planetary positions', () => {
    const chart = computeNatalChart({ jde: 2451545.0, timeKnown: false });
    expect(chart.planetaryPositions).toHaveLength(10);
  });

  it('Natal aspects are computed for significant separations', () => {
    const chart = computeNatalChart({ jde: 2451545.0, timeKnown: false });
    // At J2000.0, there should be at least some natal aspects
    expect(Array.isArray(chart.natalAspects)).toBe(true);
  });

  it('Hildegard natal chart — Sep 16 1098 Julian calendar', () => {
    const birthJDE = dateToJDE(1098, 9, 16, false); // Julian calendar
    const chart = computeNatalChart({ jde: birthJDE, timeKnown: false });
    expect(chart.planetaryPositions).toHaveLength(10);
    // Sun in mid-Virgo in mid-September
    const sun = chart.planetaryPositions.find((p) => p.planet === 'Sun');
    expect(sun!.sign).toBe('Virgo');
  });
});

describe('CosmosState Assembly', () => {
  const napoleonBirthJDE = dateToJDE(1769, 8, 15, true);
  const napoleonNatalChart = computeNatalChart({ jde: napoleonBirthJDE, timeKnown: false });

  it('CosmosState without natal chart has no transits', () => {
    const state = computeCosmosState(2451545.0);
    expect(state.activeTransits).toHaveLength(0);
    expect(state.planetaryPositions).toHaveLength(10);
  });

  it('CosmosState with natal chart populates activeTransits', () => {
    // Use a known transit: mock a date when Mars would be near Napoleon's natal Sun
    // Napoleon's natal Sun ≈ 143° (Leo 23°)
    // When Mars is within 3° of 143°, a transit should be detected
    // We test with a cosmos state computed at Napoleon's birth (self-transits)
    const state = computeCosmosState(napoleonBirthJDE, napoleonNatalChart);
    // At birth, all natal positions = transit positions → all conjunctions fire
    const conjunctions = state.activeTransits.filter((t) => t.aspectType === 'conjunction');
    expect(conjunctions.length).toBeGreaterThan(0);
  });

  it('Transit exactness score decreases with orb', () => {
    const state = computeCosmosState(napoleonBirthJDE, napoleonNatalChart);
    for (const transit of state.activeTransits) {
      const expectedScore = Math.max(0, 10 - (transit.orb / 3) * 10);
      expect(transit.exactnessScore).toBeCloseTo(expectedScore, 0);
    }
  });

  it('All transit orbs are within MAX_ASPECT_ORB (3°)', () => {
    const state = computeCosmosState(napoleonBirthJDE, napoleonNatalChart);
    for (const transit of state.activeTransits) {
      expect(transit.orb).toBeLessThanOrEqual(3.0);
    }
  });

  it('CosmosState timestamp matches the JDE', () => {
    const testJDE = 2451545.0;
    const state = computeCosmosState(testJDE);
    expect(state.julianDate).toBeCloseTo(testJDE, 1);
  });

  it('Eclipse flag is boolean', () => {
    const state = computeCosmosState(2451545.0);
    expect(typeof state.eclipseActive).toBe('boolean');
  });
});
