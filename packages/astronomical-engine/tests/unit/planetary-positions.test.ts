import { describe, it, expect } from 'vitest';
import { calculatePlanetaryPositions } from '../../src/core/planetary-positions.js';
import { J2000 } from '../../src/core/constants.js';

describe('Planetary Positions — Keplerian Elements (Meeus Ch. 33)', () => {
  it('All 10 bodies present at J2000.0', () => {
    const positions = calculatePlanetaryPositions(J2000);
    const bodies = positions.map((p) => p.planet);
    expect(bodies).toContain('Sun');
    expect(bodies).toContain('Moon');
    expect(bodies).toContain('Mercury');
    expect(bodies).toContain('Venus');
    expect(bodies).toContain('Mars');
    expect(bodies).toContain('Jupiter');
    expect(bodies).toContain('Saturn');
    expect(bodies).toContain('Uranus');
    expect(bodies).toContain('Neptune');
    expect(bodies).toContain('Pluto');
  });

  it('All longitudes in range [0, 360)', () => {
    const positions = calculatePlanetaryPositions(J2000);
    for (const pos of positions) {
      expect(pos.longitude).toBeGreaterThanOrEqual(0);
      expect(pos.longitude).toBeLessThan(360);
    }
  });

  it('Sun at J2000.0 should be near Capricorn 10° (≈280°)', () => {
    const positions = calculatePlanetaryPositions(J2000);
    const sun = positions.find((p) => p.planet === 'Sun');
    expect(sun).toBeDefined();
    expect(sun!.longitude).toBeGreaterThan(279);
    expect(sun!.longitude).toBeLessThan(283);
  });

  it('Mars at J2000.0 — geocentric position (Keplerian)', () => {
    // NOTE: Mars mean heliocentric L₀ = 355° at J2000.0, but GEOCENTRIC longitude
    // differs significantly due to Earth's position (100° heliocentric).
    // Mars heliocentric ≈ 359°, Earth at 100°, geocentric Mars ≈ 320–340°.
    const positions = calculatePlanetaryPositions(J2000);
    const mars = positions.find((p) => p.planet === 'Mars');
    expect(mars).toBeDefined();
    const lon = mars!.longitude;
    // Mars geocentric at J2000.0 — Aquarius/Pisces region due to parallax
    expect(lon).toBeGreaterThan(300);
    expect(lon).toBeLessThan(360);
  });

  it('Jupiter at J2000.0 — geocentric position (Keplerian)', () => {
    // Jupiter mean L₀ = 34° heliocentric; geocentric corrected for parallax ≈ 23–28°
    const positions = calculatePlanetaryPositions(J2000);
    const jupiter = positions.find((p) => p.planet === 'Jupiter');
    expect(jupiter).toBeDefined();
    expect(jupiter!.longitude).toBeGreaterThan(20);
    expect(jupiter!.longitude).toBeLessThan(32);
  });

  it('Saturn at J2000.0 — geocentric position (Keplerian)', () => {
    // Saturn mean L₀ = 50° heliocentric; geocentric corrected ≈ 38–44°
    const positions = calculatePlanetaryPositions(J2000);
    const saturn = positions.find((p) => p.planet === 'Saturn');
    expect(saturn).toBeDefined();
    expect(saturn!.longitude).toBeGreaterThan(35);
    expect(saturn!.longitude).toBeLessThan(46);
  });

  it('Retrograde flag is a boolean for all bodies', () => {
    const positions = calculatePlanetaryPositions(J2000);
    for (const pos of positions) {
      expect(typeof pos.isRetrograde).toBe('boolean');
    }
  });

  it('Sun and Moon are never marked retrograde', () => {
    const positions = calculatePlanetaryPositions(J2000);
    const sun = positions.find((p) => p.planet === 'Sun');
    const moon = positions.find((p) => p.planet === 'Moon');
    expect(sun!.isRetrograde).toBe(false);
    expect(moon!.isRetrograde).toBe(false);
  });

  it('Sign matches longitude (Aries = 0–30°, etc.)', () => {
    const positions = calculatePlanetaryPositions(J2000);
    for (const pos of positions) {
      const signIndex = Math.floor(pos.longitude / 30);
      const signs = [
        'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
        'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
      ];
      expect(pos.sign).toBe(signs[signIndex]);
    }
  });
});
