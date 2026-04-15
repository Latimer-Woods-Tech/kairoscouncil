import { describe, it, expect } from 'vitest';
import { evaluateDignity } from '../../src/core/dignity.js';

describe('Dignity Evaluation', () => {
  // Domicile tests
  it('Sun in Leo (120–150°) → domicile', () => {
    expect(evaluateDignity('Sun', 130)).toBe('domicile');
    expect(evaluateDignity('Sun', 143)).toBe('domicile'); // Napoleon's Sun
    expect(evaluateDignity('Sun', 149)).toBe('domicile');
  });

  it('Sun in Aries (0–30°) → exaltation', () => {
    expect(evaluateDignity('Sun', 19)).toBe('exaltation'); // exact exaltation
    expect(evaluateDignity('Sun', 15)).toBe('exaltation');
  });

  it('Sun in Aquarius (300–330°) → detriment', () => {
    expect(evaluateDignity('Sun', 315)).toBe('detriment');
  });

  it('Sun in Libra (180–210°) → fall', () => {
    expect(evaluateDignity('Sun', 195)).toBe('fall');
  });

  it('Moon in Cancer (90–120°) → domicile', () => {
    expect(evaluateDignity('Moon', 105)).toBe('domicile');
  });

  it('Moon in Taurus (30–60°) → exaltation', () => {
    expect(evaluateDignity('Moon', 33)).toBe('exaltation'); // 3° Taurus
  });

  it('Venus in Taurus (30–60°) → domicile', () => {
    expect(evaluateDignity('Venus', 45)).toBe('domicile');
  });

  it('Venus in Libra (180–210°) → domicile', () => {
    expect(evaluateDignity('Venus', 195)).toBe('domicile');
  });

  it('Mars in Aries (0–30°) → domicile', () => {
    expect(evaluateDignity('Mars', 15)).toBe('domicile');
  });

  it('Mars in Capricorn (270–300°) → exaltation', () => {
    expect(evaluateDignity('Mars', 298)).toBe('exaltation'); // 28° Capricorn
  });

  it('Mars in Taurus (30–60°) → detriment', () => {
    expect(evaluateDignity('Mars', 45)).toBe('detriment');
  });

  it('Mars in Cancer (90–120°) → fall', () => {
    expect(evaluateDignity('Mars', 105)).toBe('fall');
  });

  it('Jupiter in Cancer (90–120°) → exaltation', () => {
    expect(evaluateDignity('Jupiter', 105)).toBe('exaltation');
  });

  it('Saturn in Libra (180–210°) → exaltation', () => {
    expect(evaluateDignity('Saturn', 201)).toBe('exaltation');
  });

  it('Planet in neutral sign → peregrine', () => {
    // Sun in Gemini has no special dignity
    expect(evaluateDignity('Sun', 75)).toBe('peregrine');
  });

  // Boundary conditions
  it('Exactly at sign boundary (0° Aries) → correct sign', () => {
    expect(evaluateDignity('Sun', 0)).toBe('exaltation'); // Aries
    expect(evaluateDignity('Sun', 29.99)).toBe('exaltation'); // still Aries
    expect(evaluateDignity('Sun', 30)).toBe('peregrine'); // Taurus
  });
});
