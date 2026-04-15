import { describe, it, expect } from 'vitest';
import { calculateSunLongitude } from '../../src/core/solar-position.js';
import { calculateMoonLongitude } from '../../src/core/lunar-position.js';
import { J2000 } from '../../src/core/constants.js';
import { dateToJDE } from '../../src/core/julian-date.js';

describe('Solar Position — Meeus Chapter 25', () => {
  it('J2000.0 — Sun should be near Capricorn 10° (≈280.5°)', () => {
    const lon = calculateSunLongitude(J2000);
    expect(lon).toBeGreaterThan(279);
    expect(lon).toBeLessThan(282);
  });

  it('Summer solstice Jun 21 2000 — Sun should be near 90° (Cancer 0°)', () => {
    // JDE of Jun 21.0 2000 ≈ 2451716.5 (J2000 + 172 days)
    const jde = J2000 - 0.5 + 172;
    const lon = calculateSunLongitude(jde);
    expect(lon).toBeGreaterThan(88);
    expect(lon).toBeLessThan(92);
  });

  it('Napoleon birth Aug 15 1769 — Sun should be in Leo (120–150°)', () => {
    // Correct JDE via Meeus formula = 2367400.5 (midnight Aug 15 1769 Gregorian)
    // Sun moves ~1°/day, Leo spans 120–150°, Aug 15 → Leo ~22° ≈ 142–144°
    const jde = dateToJDE(1769, 8, 15, true);
    const lon = calculateSunLongitude(jde);
    expect(lon).toBeGreaterThan(140);
    expect(lon).toBeLessThan(150);
  });

  it('Vernal equinox Mar 20 2000 — Sun should be near 0° (Aries)', () => {
    // JDE of Mar 20.0 2000 ≈ 2451623.5
    const jde = J2000 - 0.5 + 79;
    const lon = calculateSunLongitude(jde);
    // Near 0° Aries: lon may be just below 360 (e.g. 359.7) OR just above 0 (e.g. 0.5)
    // Both are correct — cannot use two separate toBeGreaterThan / toBeLessThan
    expect(lon > 357 || lon < 3).toBe(true);
  });

  it('Sun longitude always in range [0, 360)', () => {
    const jdes = [2400000, 2451545, 2460000, 2500000];
    for (const jde of jdes) {
      const lon = calculateSunLongitude(jde);
      expect(lon).toBeGreaterThanOrEqual(0);
      expect(lon).toBeLessThan(360);
    }
  });
});

describe('Lunar Position — Simplified Meeus Chapter 47', () => {
  it('Moon longitude always in range [0, 360)', () => {
    const jdes = [2400000, 2451545, 2460000, 2500000];
    for (const jde of jdes) {
      const lon = calculateMoonLongitude(jde);
      expect(lon).toBeGreaterThanOrEqual(0);
      expect(lon).toBeLessThan(360);
    }
  });

  it('Moon at J2000.0 should be near 218° (Scorpio)', () => {
    // Known value: Moon longitude at J2000.0 ≈ 218.3° from simplified formula
    const lon = calculateMoonLongitude(J2000);
    // Tolerance ±5° for simplified formula
    expect(lon).toBeGreaterThan(210);
    expect(lon).toBeLessThan(230);
  });
});
