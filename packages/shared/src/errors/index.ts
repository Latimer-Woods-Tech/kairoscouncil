/**
 * @module @kairos/shared/errors
 * Classified error taxonomy for Kairos' Council.
 * All errors must use this taxonomy — never throw unclassified errors.
 */

/** Error codes organized by domain. */
export enum ErrorCode {
  // Astronomical Engine (1xxx)
  EPHEMERIS_CALCULATION_FAILED = 'KC-1001',
  TRANSIT_CACHE_MISS = 'KC-1002',
  INVALID_BIRTH_DATE = 'KC-1003',
  JULIAN_DATE_OVERFLOW = 'KC-1004',

  // Game Engine (2xxx)
  INVALID_MATCH_STATE = 'KC-2001',
  SEED_GENERATION_FAILED = 'KC-2002',
  ILLEGAL_GAME_ACTION = 'KC-2003',
  BURST_TRIGGER_INVALID = 'KC-2004',
  CE_INSUFFICIENT = 'KC-2005',
  FIGURE_NOT_ASCENDANT = 'KC-2006',
  ASPECT_BOND_CONFLICT = 'KC-2007',

  // API (3xxx)
  RATE_LIMIT_EXCEEDED = 'KC-3001',
  AUTH_TOKEN_INVALID = 'KC-3002',
  AUTH_TOKEN_EXPIRED = 'KC-3003',
  FORBIDDEN = 'KC-3004',
  VALIDATION_FAILED = 'KC-3005',

  // Database (4xxx)
  QUERY_FAILED = 'KC-4001',
  TRANSACTION_FAILED = 'KC-4002',
  OPTIMISTIC_LOCK_FAILED = 'KC-4003',
  MIGRATION_FAILED = 'KC-4004',

  // Economy (5xxx)
  STRIPE_WEBHOOK_INVALID = 'KC-5001',
  INSUFFICIENT_CREDITS = 'KC-5002',
  PACK_GENERATION_FAILED = 'KC-5003',
  ECONOMY_SINK_OVERFLOW = 'KC-5004',

  // Infrastructure (6xxx)
  DURABLE_OBJECT_UNAVAILABLE = 'KC-6001',
  WEBSOCKET_CONNECTION_FAILED = 'KC-6002',
  CACHE_WRITE_FAILED = 'KC-6003',
}

/**
 * Base error class for all Kairos' Council errors.
 * Every thrown error must be an instance of this class.
 */
export class KairosError extends Error {
  constructor(
    public readonly code: ErrorCode,
    message: string,
    public readonly context?: Record<string, unknown>,
    public readonly retryable: boolean = false,
  ) {
    super(message);
    this.name = 'KairosError';
  }

  /** Serialize for API responses. */
  toJSON(): { code: string; message: string; retryable: boolean } {
    return {
      code: this.code,
      message: this.message,
      retryable: this.retryable,
    };
  }
}
