/**
 * @module @kairos/game-engine/seed
 * Deterministic pseudo-random number generator for match reproducibility.
 *
 * AC-003: Every match is locked to a timestamp+seed at initiation.
 *         All probabilistic elements use this seed system.
 *         Math.random() is BANNED in game-engine — use SeededRandom instead.
 *         LL-002: This constraint is non-negotiable for competitive integrity.
 *
 * Algorithm: Mulberry32 — a fast, high-quality 32-bit PRNG.
 * Properties: deterministic, reproducible, no external state.
 */

import { KairosError, ErrorCode } from '@kairos/shared';

/**
 * Deterministic pseudo-random number generator locked to a match seed.
 * All probabilistic game mechanics (Square bond misfire, Unstable Sky,
 * pack draws) MUST use this class.
 *
 * @example
 * const rng = new SeededRandom(matchState.seed);
 * // Advance state by skipping to turn N
 * rng.advanceToTurn(matchState.turn);
 * // Use in game logic
 * const misfired = rng.nextBool(SQUARE_MISFIRE_CHANCE);
 *
 * @see AC-003 — Deterministic Seeds
 */
export class SeededRandom {
  private state: number;

  /**
   * Creates a SeededRandom from a bigint match seed.
   * Converts the 64-bit seed to a 32-bit state via XOR folding.
   *
   * @param seed - Match seed (bigint from MatchState.seed)
   * @throws KairosError KC-2002 if seed is 0 (degenerate case)
   */
  constructor(seed: bigint) {
    if (seed === 0n) {
      throw new KairosError(
        ErrorCode.SEED_GENERATION_FAILED,
        'Match seed cannot be zero — degenerate PRNG state',
        { seed: seed.toString() },
      );
    }
    // XOR-fold 64-bit bigint to 32-bit unsigned integer
    const lo = Number(seed & 0xFFFFFFFFn);
    const hi = Number((seed >> 32n) & 0xFFFFFFFFn);
    this.state = (lo ^ hi) >>> 0;
    if (this.state === 0) this.state = 0x12345678; // fallback for xor-zero case
  }

  /**
   * Advances the PRNG state by one step using Mulberry32.
   * Returns a float in [0, 1).
   *
   * Mulberry32 by Tommy Ettinger — public domain.
   *
   * @returns Float in [0, 1)
   */
  next(): number {
    this.state = (this.state + 0x6D2B79F5) >>> 0;
    let z = Math.imul(this.state ^ (this.state >>> 15), 1 | this.state);
    z = (z ^ (z + Math.imul(z ^ (z >>> 7), 61 | z))) >>> 0;
    return ((z ^ (z >>> 14)) >>> 0) / 4294967296;
  }

  /**
   * Returns a random integer in [min, max] (inclusive on both ends).
   *
   * @param min - Minimum value (inclusive)
   * @param max - Maximum value (inclusive)
   * @returns Integer in [min, max]
   */
  nextInt(min: number, max: number): number {
    return Math.floor(this.next() * (max - min + 1)) + min;
  }

  /**
   * Returns true with the given probability.
   * Used for Square bond misfire (30%) and Unstable Sky randomization.
   *
   * @param probability - Probability in [0, 1]
   * @returns true with P(probability)
   *
   * @example
   * // Square bond misfire — AC-003 compliant
   * const misfired = rng.nextBool(SQUARE_MISFIRE_CHANCE); // 0.3
   */
  nextBool(probability: number): boolean {
    return this.next() < probability;
  }

  /**
   * Returns a copy of the array shuffled using Fisher-Yates.
   * Original array is not modified.
   * Used for deck shuffling at match initialization.
   *
   * @param arr - Array to shuffle
   * @returns New shuffled array
   */
  shuffle<T>(arr: readonly T[]): T[] {
    const result = [...arr];
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(this.next() * (i + 1));
      // Swap
      const temp = result[i]!;
      result[i] = result[j]!;
      result[j] = temp;
    }
    return result;
  }

  /**
   * Advances the PRNG state by N steps without capturing values.
   * Used to fast-forward to a specific turn's RNG state for replay.
   *
   * @param n - Number of steps to advance
   */
  advance(n: number): void {
    for (let i = 0; i < n; i++) {
      this.next();
    }
  }

  /**
   * Returns the current internal state (for serialization/debugging only).
   * Do NOT use this value in game logic.
   */
  get currentState(): number {
    return this.state;
  }
}

/**
 * Generates a deterministic match seed from a timestamp and optional salt.
 * The seed combines the timestamp's milliseconds with a simple hash of the salt.
 *
 * @param timestamp - Match initiation time
 * @param salt - Optional additional entropy (e.g., player ID XOR)
 * @returns bigint seed for the match
 *
 * @throws KairosError KC-2002 if seed generation produces zero
 *
 * @example
 * const seed = generateMatchSeed(new Date(), player1Id + player2Id);
 *
 * @see AC-003 — Deterministic Seeds
 */
export function generateMatchSeed(timestamp: Date, salt = ''): bigint {
  const tsMs = BigInt(timestamp.getTime());

  // FNV-1a hash of the salt string for additional entropy
  let saltHash = 0x811C9DC5n;
  for (let i = 0; i < salt.length; i++) {
    saltHash ^= BigInt(salt.charCodeAt(i));
    saltHash = (saltHash * 0x01000193n) & 0xFFFFFFFFn;
  }

  const seed = (tsMs ^ (saltHash << 17n) ^ (saltHash >> 13n)) & 0xFFFFFFFFFFFFFFFFn;

  if (seed === 0n) {
    throw new KairosError(
      ErrorCode.SEED_GENERATION_FAILED,
      'Generated seed is zero — retry with different timestamp',
      { timestamp: timestamp.toISOString(), salt },
    );
  }

  return seed;
}
