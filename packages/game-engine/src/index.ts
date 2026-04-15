/**
 * @module @kairos/game-engine
 * Match logic, combat, bonds, bursts, and Transit Clock management.
 *
 * AC-002: All game state is authoritative server-side.
 * AC-003: All probabilistic elements use the deterministic seed system.
 * This package consumes astronomical output but NEVER imports engine internals (AC-001).
 */

// Deterministic seed system — AC-003
export * from './seed/index.js';

// Match state management — AC-002, AC-003
export * from './match/index.js';

// Combat damage calculation — AC-005, AC-006
export * from './combat/index.js';

// Aspect bond logic — GAME_DESIGN §7.6
export * from './bonds/index.js';

// Burst trigger evaluation — GAME_DESIGN §8.3
export * from './bursts/index.js';

// Transit Clock management — GAME_DESIGN §7.9
export * from './clock/index.js';
