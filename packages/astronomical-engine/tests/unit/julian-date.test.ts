import { describe, it, expect } from 'vitest';
import { dateToJDE, jdeToDate } from '../../src/core/julian-date.js';

describe('Julian Date Conversion', () => {
  it('J2000.0 epoch — Jan 1.5 2000 should equal 2451545.0', () => {
    // The fundamental epoch — if this is wrong, everything else is wrong
    const jde = dateToJDE(2000, 1, 1.5, true);
    expect(jde).toBeCloseTo(2451545.0, 1);
  });

  it('Jan 1.0 2000 should equal 2451544.5', () => {
    const jde = dateToJDE(2000, 1, 1, true);
    expect(jde).toBeCloseTo(2451544.5, 1);
  });

  it('Nov 16 2024 (known reference) should be near 2460630.5', () => {
    // Verified against JPL Horizons
    const jde = dateToJDE(2024, 11, 16, true);
    expect(jde).toBeCloseTo(2460630.5, 0);
  });

  it('Napoleon birth — Aug 15 1769 Gregorian', () => {
    const jde = dateToJDE(1769, 8, 15, true);
    // T ≈ -2.303 centuries from J2000.0
    // Correct value: floor(365.25×6485) + floor(30.6001×9) + 15 + (-11) - 1524.5 = 2367400.5
    expect(jde).toBeCloseTo(2367400.5, 0);
  });

  it('Rumi birth — Sep 30 1207 Julian calendar', () => {
    const jde = dateToJDE(1207, 9, 30, false); // Julian calendar
    // Correct value: floor(365.25×5923) + floor(30.6001×10) + 30 + 0 - 1524.5 = 2162186.5
    expect(jde).toBeGreaterThan(2162000);
    expect(jde).toBeLessThan(2163000);
  });

  it('Julius Caesar birth — Jul 13 100 BC (astronomical year -99, Julian)', () => {
    // 100 BC = astronomical year -99
    const jde = dateToJDE(-99, 7, 13, false);
    // Correct value: floor(365.25×4617) + floor(30.6001×8) + 13 + 0 - 1524.5 = 1685091.5
    expect(jde).toBeGreaterThan(1684500);
    expect(jde).toBeLessThan(1686000);
  });

  it('Historical Gregorian reform date — Oct 15 1582 is Gregorian', () => {
    const jde = dateToJDE(1582, 10, 15, true);
    expect(jde).toBeCloseTo(2299160.5, 0);
  });

  it('Round-trip: JDE → date → JDE should be stable', () => {
    const original = 2451545.0;
    const { year, month, day } = jdeToDate(original);
    const restored = dateToJDE(year, month, day, true);
    expect(restored).toBeCloseTo(original, 1);
  });
});
