import { describe, it, expect } from 'vitest';
import { getForgeIntensity, getNamedEvent } from '../../src/event-mapper/index.js';
import type { PlanetaryPosition, TransitData } from '@kairos/shared';

function makeTransit(orb: number): TransitData {
  return {
    transitingPlanet: 'Mars',
    natalPlanet: 'Sun',
    aspectType: 'conjunction',
    orb,
    exactnessScore: Math.max(0, 10 - (orb / 3) * 10),
    isApplying: true,
  };
}

describe('Forge Intensity — AC-007 / Event Mapper', () => {
  it('Ruling planet >5° from any aspect → Intensity 1', () => {
    const transits = [makeTransit(5.5)];
    expect(getForgeIntensity(transits)).toBe(1);
  });

  it('Ruling planet within 5° of aspect → Intensity 2', () => {
    const transits = [makeTransit(3.0)];
    expect(getForgeIntensity(transits)).toBe(2);
  });

  it('Ruling planet within 1° of aspect → Intensity 3', () => {
    const transits = [makeTransit(0.4)];
    expect(getForgeIntensity(transits)).toBe(3);
  });

  it('Exact aspect at 0° → Intensity 3', () => {
    const transits = [makeTransit(0)];
    expect(getForgeIntensity(transits)).toBe(3);
  });

  it('Named event active overrides to Intensity 3', () => {
    const transits = [makeTransit(5.5)]; // would be Intensity 1
    expect(getForgeIntensity(transits, true)).toBe(3);
  });

  it('No transits → Intensity 1', () => {
    expect(getForgeIntensity([])).toBe(1);
  });

  it('Uses minimum orb among multiple transits', () => {
    const transits = [makeTransit(4.0), makeTransit(0.8)];
    // min orb is 0.8° → within 1° → Intensity 3
    expect(getForgeIntensity(transits)).toBe(3);
  });
});

describe('Named Event Detection — Event Mapper', () => {
  function makeMarsPosition(longitude: number): PlanetaryPosition {
    return {
      planet: 'Mars',
      longitude,
      latitude: 0,
      sign: 'Aries',
      degree: longitude % 30,
      isRetrograde: false,
      dignity: 'domicile',
    };
  }

  it('Crimson Alignment: Mars within 1° of natal Mars → detected', () => {
    const currentPositions: PlanetaryPosition[] = [makeMarsPosition(143.4)];
    const natalMarsLongitude = 143.0;
    const event = getNamedEvent(currentPositions, { natalMarsLongitude });
    expect(event).toBe('Crimson Alignment');
  });

  it('No named event when Mars is far from natal positions', () => {
    const currentPositions: PlanetaryPosition[] = [makeMarsPosition(200)];
    const event = getNamedEvent(currentPositions, { natalMarsLongitude: 143.0 });
    expect(event).toBeNull();
  });
});
