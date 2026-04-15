/**
 * @module @kairos/astronomical-engine/event-mapper
 * Translates Core Layer ephemeris data into named game states.
 * AC-001: ALL balance tuning happens here. Never in the Core Layer.
 * Assigns Forge Intensity (1/2/3) based on orb thresholds.
 */

export { getForgeIntensity, filterRulingPlanetTransits } from './forge-intensity.js';
export { getNamedEvent, detectNamedEvents } from './named-events.js';
