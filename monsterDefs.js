// Server-side monster def + spawn tables for Europe.
// Mirrors the *combat-relevant* fields from src/game/monsters.ts so the
// authoritative AI loop on Render doesn't need the full client bundle.
//
// Phase 1A: Wildwood spawns + 9 monster defs that appear there.
// Phase 1B will add Frontier + the additional ~50 def entries.

const TILE_SIZE = 32;

/**
 * Wildwood spawn list. MUST stay in sync with WILDWOOD_SPAWNS in
 * src/game/monsters.ts so monster_key indices align with client expectations.
 */
const WILDWOOD_SPAWNS = [
  { defId: 'slime',    tileX: 6,  tileY: 12 },
  { defId: 'slime',    tileX: 9,  tileY: 7  },
  { defId: 'frog',     tileX: 4,  tileY: 17 },
  { defId: 'frog',     tileX: 11, tileY: 19 },
  { defId: 'mushroom', tileX: 18, tileY: 10 },
  { defId: 'snake',    tileX: 22, tileY: 22 },
  { defId: 'mushroom', tileX: 25, tileY: 17 },
  { defId: 'snake',    tileX: 17, tileY: 8  },
  { defId: 'piranha',  tileX: 19, tileY: 24 },
  { defId: 'boar',     tileX: 24, tileY: 25 },
  { defId: 'snail',    tileX: 30, tileY: 18 },
  { defId: 'snail',    tileX: 34, tileY: 21 },
  { defId: 'snail',    tileX: 36, tileY: 12 },
  { defId: 'fire_imp', tileX: 32, tileY: 9  },
  { defId: 'reaper',   tileX: 35, tileY: 6  },
  { defId: 'reaper',   tileX: 30, tileY: 23 },
  { defId: 'fire_imp', tileX: 36, tileY: 18 },
];

/** Combat-relevant def fields only. */
const MONSTER_DEFS = {
  snake:    { id: 'snake',    maxHp: 20,  attack: 3,  speed: 0.45, aggroTiles: 3, attackRangePx: 22, attackCdMs: 1500 },
  slime:    { id: 'slime',    maxHp: 25,  attack: 4,  speed: 0.55, aggroTiles: 3, attackRangePx: 20, attackCdMs: 1600 },
  piranha:  { id: 'piranha',  maxHp: 35,  attack: 6,  speed: 0,    aggroTiles: 2, attackRangePx: 28, attackCdMs: 1800, stationary: true },
  boar:     { id: 'boar',     maxHp: 60,  attack: 8,  speed: 0.7,  aggroTiles: 4, attackRangePx: 24, attackCdMs: 1700 },
  frog:     { id: 'frog',     maxHp: 30,  attack: 5,  speed: 0.45, aggroTiles: 3, attackRangePx: 26, attackCdMs: 1600 },
  mushroom: { id: 'mushroom', maxHp: 40,  attack: 5,  speed: 0.35, aggroTiles: 3, attackRangePx: 22, attackCdMs: 1800 },
  reaper:   { id: 'reaper',   maxHp: 80,  attack: 12, speed: 0.55, aggroTiles: 4, attackRangePx: 30, attackCdMs: 1900 },
  fire_imp: { id: 'fire_imp', maxHp: 45,  attack: 10, speed: 0.45, aggroTiles: 5, attackRangePx: 110, attackCdMs: 2400 },
  snail:    { id: 'snail',    maxHp: 100, attack: 6,  speed: 0.18, aggroTiles: 2, attackRangePx: 22, attackCdMs: 2400 },
};

module.exports = { TILE_SIZE, WILDWOOD_SPAWNS, MONSTER_DEFS };
