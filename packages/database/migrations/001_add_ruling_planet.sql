-- Migration 001: Add ruling_planet column to figures table
-- Task 5: Phase 0 figure data requires ruling_planet for Forge Intensity calculation.
-- The ruling planet is the primary celestial body tracked for a figure's Forge school.
--
-- NOTE: Phase 0 assumption — the figures table is empty before this migration runs.
-- In production, run this before the Phase 0 seed. If figures already exist (schema reset
-- was not clean), remove or update the NOT NULL DEFAULT before running.

ALTER TABLE figures
  ADD COLUMN ruling_planet TEXT NOT NULL DEFAULT 'Sun'
    CHECK (ruling_planet IN ('Sun','Moon','Mercury','Venus','Mars','Jupiter','Saturn','Uranus','Neptune','Pluto'));
