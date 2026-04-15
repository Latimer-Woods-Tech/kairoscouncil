-- Kairos' Council — Phase 0 Schema
-- Core tables. Migrations tracked in packages/database/migrations/

CREATE TABLE figures (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  birth_date DATE NOT NULL,
  birth_date_precision TEXT NOT NULL CHECK (birth_date_precision IN ('verified','estimated','attributed','legendary')),
  birth_location_lat DECIMAL(9,6),
  birth_location_lng DECIMAL(9,6),
  birth_time_known BOOLEAN DEFAULT FALSE,
  archetype_school TEXT NOT NULL,
  primary_forge TEXT NOT NULL,
  secondary_forge TEXT,
  natal_aspects JSONB NOT NULL DEFAULT '[]',
  personal_lore TEXT,
  era TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE transit_cache (
  figure_id UUID REFERENCES figures(id),
  calculated_at TIMESTAMPTZ NOT NULL,
  transit_power INTEGER NOT NULL CHECK (transit_power BETWEEN 40 AND 100),
  active_aspects JSONB NOT NULL DEFAULT '[]',
  forge_intensity JSONB NOT NULL,
  retrograde_modified BOOLEAN DEFAULT FALSE,
  solar_return_active BOOLEAN DEFAULT FALSE,
  named_event TEXT,
  valid_until TIMESTAMPTZ NOT NULL,
  PRIMARY KEY (figure_id, calculated_at)
);

CREATE TABLE players (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  display_name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_active TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mode TEXT NOT NULL CHECK (mode IN ('transit','eclipse','chart')),
  seed BIGINT NOT NULL,
  seed_timestamp TIMESTAMPTZ NOT NULL,
  player_ids JSONB NOT NULL,
  match_state JSONB NOT NULL DEFAULT '{}',
  transit_clock_states JSONB NOT NULL DEFAULT '{}',
  cosmos_snapshot JSONB NOT NULL,
  winner_id UUID REFERENCES players(id),
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE decks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID REFERENCES players(id),
  name TEXT NOT NULL,
  archetype_school TEXT NOT NULL,
  card_ids JSONB NOT NULL,
  council_leader_id UUID REFERENCES figures(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE processed_events (
  event_id TEXT PRIMARY KEY,
  event_type TEXT NOT NULL,
  processed_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_transit_cache_valid_until ON transit_cache(valid_until);
CREATE INDEX idx_transit_cache_figure ON transit_cache(figure_id, valid_until DESC);
CREATE INDEX idx_matches_player ON matches USING GIN(player_ids);
CREATE INDEX idx_decks_owner ON decks(owner_id);
