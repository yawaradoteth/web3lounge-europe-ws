// AUTO-GENERATED from src/game/monsters.ts + src/game/frontierMap.ts
// Re-run scripts/genMonsterDefs.js to refresh.

const TILE_SIZE = 32;

const MONSTER_DEFS = {
  "snake": {
    "id": "snake",
    "maxHp": 20,
    "attack": 3,
    "speed": 0.45,
    "aggroTiles": 3,
    "attackRangePx": 22,
    "attackCdMs": 1500,
    "attackKind": "lunge"
  },
  "slime": {
    "id": "slime",
    "maxHp": 25,
    "attack": 4,
    "speed": 0.55,
    "aggroTiles": 3,
    "attackRangePx": 20,
    "attackCdMs": 1600,
    "attackKind": "lunge"
  },
  "piranha": {
    "id": "piranha",
    "maxHp": 35,
    "attack": 6,
    "speed": 0,
    "aggroTiles": 2,
    "attackRangePx": 28,
    "attackCdMs": 1800,
    "attackKind": "snap",
    "stationary": true
  },
  "boar": {
    "id": "boar",
    "maxHp": 60,
    "attack": 8,
    "speed": 0.7,
    "aggroTiles": 4,
    "attackRangePx": 24,
    "attackCdMs": 1700,
    "attackKind": "lunge"
  },
  "frog": {
    "id": "frog",
    "maxHp": 30,
    "attack": 5,
    "speed": 0.45,
    "aggroTiles": 3,
    "attackRangePx": 26,
    "attackCdMs": 1600,
    "attackKind": "lunge"
  },
  "mushroom": {
    "id": "mushroom",
    "maxHp": 40,
    "attack": 5,
    "speed": 0.35,
    "aggroTiles": 3,
    "attackRangePx": 22,
    "attackCdMs": 1800,
    "attackKind": "lunge"
  },
  "reaper": {
    "id": "reaper",
    "maxHp": 80,
    "attack": 12,
    "speed": 0.55,
    "aggroTiles": 4,
    "attackRangePx": 30,
    "attackCdMs": 1900,
    "attackKind": "scythe"
  },
  "fire_imp": {
    "id": "fire_imp",
    "maxHp": 45,
    "attack": 10,
    "speed": 0.45,
    "aggroTiles": 5,
    "attackRangePx": 110,
    "attackCdMs": 2400,
    "attackKind": "fireball",
    "preferredRangePx": 90
  },
  "snail": {
    "id": "snail",
    "maxHp": 100,
    "attack": 6,
    "speed": 0.18,
    "aggroTiles": 2,
    "attackRangePx": 22,
    "attackCdMs": 2400,
    "attackKind": "lunge"
  },
  "field_rat": {
    "id": "field_rat",
    "maxHp": 18,
    "attack": 3,
    "speed": 0.85,
    "aggroTiles": 4,
    "attackRangePx": 22,
    "attackCdMs": 1100,
    "attackKind": "lunge",
    "role": "swift",
    "level": 3
  },
  "wisp_moth": {
    "id": "wisp_moth",
    "maxHp": 22,
    "attack": 7,
    "speed": 0.4,
    "aggroTiles": 5,
    "attackRangePx": 130,
    "attackCdMs": 2400,
    "attackKind": "magic_orb",
    "role": "magic",
    "level": 5,
    "preferredRangePx": 110,
    "projectileColorPrimary": "#fff8c0",
    "projectileColorSecondary": "#e8c248"
  },
  "thorn_sprite": {
    "id": "thorn_sprite",
    "maxHp": 30,
    "attack": 6,
    "speed": 0.5,
    "aggroTiles": 5,
    "attackRangePx": 140,
    "attackCdMs": 1900,
    "attackKind": "arrow",
    "role": "ranged",
    "level": 7,
    "preferredRangePx": 120,
    "projectileColorPrimary": "#a8e088",
    "projectileColorSecondary": "#3a8a3a"
  },
  "rock_turtle": {
    "id": "rock_turtle",
    "maxHp": 110,
    "attack": 9,
    "speed": 0.18,
    "aggroTiles": 3,
    "attackRangePx": 24,
    "attackCdMs": 2400,
    "attackKind": "slam",
    "role": "tank",
    "level": 9
  },
  "bog_lurker": {
    "id": "bog_lurker",
    "maxHp": 70,
    "attack": 11,
    "speed": 0.55,
    "aggroTiles": 4,
    "attackRangePx": 24,
    "attackCdMs": 1700,
    "attackKind": "lunge",
    "role": "melee",
    "level": 12
  },
  "fen_archer": {
    "id": "fen_archer",
    "maxHp": 60,
    "attack": 13,
    "speed": 0.5,
    "aggroTiles": 6,
    "attackRangePx": 160,
    "attackCdMs": 2000,
    "attackKind": "arrow",
    "role": "ranged",
    "level": 14,
    "preferredRangePx": 140,
    "projectileColorPrimary": "#d8c890",
    "projectileColorSecondary": "#5a3a1a"
  },
  "marsh_caster": {
    "id": "marsh_caster",
    "maxHp": 75,
    "attack": 19,
    "speed": 0.4,
    "aggroTiles": 6,
    "attackRangePx": 170,
    "attackCdMs": 2500,
    "attackKind": "magic_orb",
    "role": "magic",
    "level": 16,
    "preferredRangePx": 150,
    "projectileColorPrimary": "#a8c8ff",
    "projectileColorSecondary": "#3a5a90"
  },
  "mire_brute": {
    "id": "mire_brute",
    "maxHp": 180,
    "attack": 18,
    "speed": 0.3,
    "aggroTiles": 4,
    "attackRangePx": 28,
    "attackCdMs": 2500,
    "attackKind": "slam",
    "role": "tank",
    "level": 19
  },
  "ash_hound": {
    "id": "ash_hound",
    "maxHp": 95,
    "attack": 18,
    "speed": 0.95,
    "aggroTiles": 5,
    "attackRangePx": 24,
    "attackCdMs": 1200,
    "attackKind": "lunge",
    "role": "swift",
    "level": 22
  },
  "cinder_archer": {
    "id": "cinder_archer",
    "maxHp": 100,
    "attack": 22,
    "speed": 0.5,
    "aggroTiles": 6,
    "attackRangePx": 170,
    "attackCdMs": 2000,
    "attackKind": "arrow",
    "role": "ranged",
    "level": 24,
    "preferredRangePx": 150,
    "projectileColorPrimary": "#ffb060",
    "projectileColorSecondary": "#a02000"
  },
  "ember_warlock": {
    "id": "ember_warlock",
    "maxHp": 130,
    "attack": 34,
    "speed": 0.4,
    "aggroTiles": 6,
    "attackRangePx": 180,
    "attackCdMs": 2600,
    "attackKind": "fireball",
    "role": "magic",
    "level": 27,
    "preferredRangePx": 160,
    "projectileColorPrimary": "#ff8030",
    "projectileColorSecondary": "#ffd060"
  },
  "magma_golem": {
    "id": "magma_golem",
    "maxHp": 320,
    "attack": 30,
    "speed": 0.25,
    "aggroTiles": 4,
    "attackRangePx": 30,
    "attackCdMs": 2600,
    "attackKind": "slam",
    "role": "tank",
    "level": 30
  },
  "shard_stalker": {
    "id": "shard_stalker",
    "maxHp": 180,
    "attack": 30,
    "speed": 0.65,
    "aggroTiles": 5,
    "attackRangePx": 26,
    "attackCdMs": 1700,
    "attackKind": "lunge",
    "role": "melee",
    "level": 32
  },
  "prism_sniper": {
    "id": "prism_sniper",
    "maxHp": 160,
    "attack": 36,
    "speed": 0.5,
    "aggroTiles": 7,
    "attackRangePx": 200,
    "attackCdMs": 2100,
    "attackKind": "arrow",
    "role": "ranged",
    "level": 34,
    "preferredRangePx": 180,
    "projectileColorPrimary": "#a8f0e0",
    "projectileColorSecondary": "#3a8aa0"
  },
  "crystal_seer": {
    "id": "crystal_seer",
    "maxHp": 200,
    "attack": 54,
    "speed": 0.4,
    "aggroTiles": 7,
    "attackRangePx": 200,
    "attackCdMs": 2700,
    "attackKind": "magic_orb",
    "role": "magic",
    "level": 37,
    "preferredRangePx": 170,
    "projectileColorPrimary": "#e0a8ff",
    "projectileColorSecondary": "#7a3ad8"
  },
  "geode_guard": {
    "id": "geode_guard",
    "maxHp": 480,
    "attack": 44,
    "speed": 0.22,
    "aggroTiles": 4,
    "attackRangePx": 30,
    "attackCdMs": 2700,
    "attackKind": "slam",
    "role": "tank",
    "level": 40
  },
  "storm_harpy": {
    "id": "storm_harpy",
    "maxHp": 240,
    "attack": 44,
    "speed": 1,
    "aggroTiles": 6,
    "attackRangePx": 24,
    "attackCdMs": 1200,
    "attackKind": "lunge",
    "role": "swift",
    "level": 42
  },
  "gale_archer": {
    "id": "gale_archer",
    "maxHp": 220,
    "attack": 50,
    "speed": 0.55,
    "aggroTiles": 7,
    "attackRangePx": 210,
    "attackCdMs": 2000,
    "attackKind": "arrow",
    "role": "ranged",
    "level": 44,
    "preferredRangePx": 190,
    "projectileColorPrimary": "#e0f0ff",
    "projectileColorSecondary": "#3a5aa0"
  },
  "thunder_shaman": {
    "id": "thunder_shaman",
    "maxHp": 280,
    "attack": 76,
    "speed": 0.42,
    "aggroTiles": 7,
    "attackRangePx": 210,
    "attackCdMs": 2800,
    "attackKind": "magic_orb",
    "role": "magic",
    "level": 47,
    "preferredRangePx": 180,
    "projectileColorPrimary": "#fff8c0",
    "projectileColorSecondary": "#3a5aa0"
  },
  "rime_giant": {
    "id": "rime_giant",
    "maxHp": 700,
    "attack": 62,
    "speed": 0.22,
    "aggroTiles": 4,
    "attackRangePx": 32,
    "attackCdMs": 2700,
    "attackKind": "slam",
    "role": "tank",
    "level": 50
  },
  "void_wraith": {
    "id": "void_wraith",
    "maxHp": 360,
    "attack": 64,
    "speed": 0.7,
    "aggroTiles": 5,
    "attackRangePx": 28,
    "attackCdMs": 1800,
    "attackKind": "scythe",
    "role": "melee",
    "level": 52
  },
  "eye_of_void": {
    "id": "eye_of_void",
    "maxHp": 320,
    "attack": 70,
    "speed": 0.45,
    "aggroTiles": 7,
    "attackRangePx": 220,
    "attackCdMs": 2200,
    "attackKind": "magic_orb",
    "role": "ranged",
    "level": 54,
    "preferredRangePx": 200,
    "projectileColorPrimary": "#ff80c0",
    "projectileColorSecondary": "#5a1a3a"
  },
  "astral_caster": {
    "id": "astral_caster",
    "maxHp": 400,
    "attack": 105,
    "speed": 0.42,
    "aggroTiles": 7,
    "attackRangePx": 230,
    "attackCdMs": 2900,
    "attackKind": "magic_orb",
    "role": "magic",
    "level": 57,
    "preferredRangePx": 200,
    "projectileColorPrimary": "#c0a8ff",
    "projectileColorSecondary": "#3a1a8a"
  },
  "voidlord": {
    "id": "voidlord",
    "maxHp": 1000,
    "attack": 90,
    "speed": 0.25,
    "aggroTiles": 5,
    "attackRangePx": 32,
    "attackCdMs": 2800,
    "attackKind": "slam",
    "role": "tank",
    "level": 60
  },
  "thornback_stalker": {
    "id": "thornback_stalker",
    "maxHp": 1250,
    "attack": 110,
    "speed": 0.72,
    "aggroTiles": 5,
    "attackRangePx": 28,
    "attackCdMs": 1700,
    "attackKind": "lunge",
    "role": "melee",
    "level": 62
  },
  "ember_wolf": {
    "id": "ember_wolf",
    "maxHp": 1080,
    "attack": 122,
    "speed": 1.05,
    "aggroTiles": 6,
    "attackRangePx": 24,
    "attackCdMs": 1200,
    "attackKind": "lunge",
    "role": "swift",
    "level": 64
  },
  "ironhide_boar": {
    "id": "ironhide_boar",
    "maxHp": 2200,
    "attack": 130,
    "speed": 0.28,
    "aggroTiles": 4,
    "attackRangePx": 30,
    "attackCdMs": 2700,
    "attackKind": "slam",
    "role": "tank",
    "level": 67
  },
  "darkroot_shaman": {
    "id": "darkroot_shaman",
    "maxHp": 1320,
    "attack": 150,
    "speed": 0.42,
    "aggroTiles": 7,
    "attackRangePx": 230,
    "attackCdMs": 2700,
    "attackKind": "magic_orb",
    "role": "magic",
    "level": 70,
    "preferredRangePx": 200,
    "projectileColorPrimary": "#a8ffb8",
    "projectileColorSecondary": "#3a6a3a"
  },
  "voidfang_panther": {
    "id": "voidfang_panther",
    "maxHp": 1500,
    "attack": 160,
    "speed": 1.1,
    "aggroTiles": 6,
    "attackRangePx": 26,
    "attackCdMs": 1150,
    "attackKind": "lunge",
    "role": "swift",
    "level": 72
  },
  "ashbone_archer": {
    "id": "ashbone_archer",
    "maxHp": 1400,
    "attack": 175,
    "speed": 0.55,
    "aggroTiles": 7,
    "attackRangePx": 230,
    "attackCdMs": 2000,
    "attackKind": "arrow",
    "role": "ranged",
    "level": 74,
    "preferredRangePx": 200,
    "projectileColorPrimary": "#fff0c0",
    "projectileColorSecondary": "#5a3a20"
  },
  "crystal_golem": {
    "id": "crystal_golem",
    "maxHp": 2900,
    "attack": 180,
    "speed": 0.24,
    "aggroTiles": 4,
    "attackRangePx": 32,
    "attackCdMs": 2700,
    "attackKind": "slam",
    "role": "tank",
    "level": 77
  },
  "hexwing_caster": {
    "id": "hexwing_caster",
    "maxHp": 1700,
    "attack": 205,
    "speed": 0.42,
    "aggroTiles": 7,
    "attackRangePx": 240,
    "attackCdMs": 2700,
    "attackKind": "magic_orb",
    "role": "magic",
    "level": 80,
    "preferredRangePx": 210,
    "projectileColorPrimary": "#ff80e0",
    "projectileColorSecondary": "#3a1a5a"
  },
  "dreadhorn_beast": {
    "id": "dreadhorn_beast",
    "maxHp": 3500,
    "attack": 215,
    "speed": 0.3,
    "aggroTiles": 5,
    "attackRangePx": 32,
    "attackCdMs": 2700,
    "attackKind": "slam",
    "role": "tank",
    "level": 82
  },
  "nightshade_rogue": {
    "id": "nightshade_rogue",
    "maxHp": 1850,
    "attack": 235,
    "speed": 1.15,
    "aggroTiles": 6,
    "attackRangePx": 26,
    "attackCdMs": 1100,
    "attackKind": "lunge",
    "role": "swift",
    "level": 84
  },
  "stormscale_drake": {
    "id": "stormscale_drake",
    "maxHp": 2100,
    "attack": 245,
    "speed": 0.55,
    "aggroTiles": 7,
    "attackRangePx": 240,
    "attackCdMs": 2100,
    "attackKind": "fireball",
    "role": "ranged",
    "level": 87,
    "preferredRangePx": 210,
    "projectileColorPrimary": "#a8e0ff",
    "projectileColorSecondary": "#3a5a90"
  },
  "abyssal_mage": {
    "id": "abyssal_mage",
    "maxHp": 2200,
    "attack": 280,
    "speed": 0.42,
    "aggroTiles": 8,
    "attackRangePx": 250,
    "attackCdMs": 2700,
    "attackKind": "magic_orb",
    "role": "magic",
    "level": 90,
    "preferredRangePx": 220,
    "projectileColorPrimary": "#c0a0ff",
    "projectileColorSecondary": "#3a1a6a"
  },
  "obsidian_reaver": {
    "id": "obsidian_reaver",
    "maxHp": 2800,
    "attack": 305,
    "speed": 0.78,
    "aggroTiles": 6,
    "attackRangePx": 30,
    "attackCdMs": 1700,
    "attackKind": "scythe",
    "role": "melee",
    "level": 92
  },
  "ancient_treant": {
    "id": "ancient_treant",
    "maxHp": 4800,
    "attack": 310,
    "speed": 0.22,
    "aggroTiles": 5,
    "attackRangePx": 34,
    "attackCdMs": 2900,
    "attackKind": "slam",
    "role": "tank",
    "level": 94
  },
  "bloodmoon_wraith": {
    "id": "bloodmoon_wraith",
    "maxHp": 2600,
    "attack": 340,
    "speed": 0.45,
    "aggroTiles": 8,
    "attackRangePx": 250,
    "attackCdMs": 2600,
    "attackKind": "magic_orb",
    "role": "magic",
    "level": 96,
    "preferredRangePx": 220,
    "projectileColorPrimary": "#ff80a0",
    "projectileColorSecondary": "#5a0a1a"
  },
  "riftborn_guardian": {
    "id": "riftborn_guardian",
    "maxHp": 3400,
    "attack": 360,
    "speed": 0.55,
    "aggroTiles": 8,
    "attackRangePx": 260,
    "attackCdMs": 2000,
    "attackKind": "arrow",
    "role": "ranged",
    "level": 99,
    "preferredRangePx": 230,
    "projectileColorPrimary": "#a8fff0",
    "projectileColorSecondary": "#3a6a8a"
  },
  "greenfield_king": {
    "id": "greenfield_king",
    "maxHp": 320,
    "attack": 14,
    "speed": 0.3,
    "aggroTiles": 6,
    "attackRangePx": 30,
    "attackCdMs": 2200,
    "attackKind": "slam",
    "role": "tank",
    "level": 10
  },
  "fen_witch": {
    "id": "fen_witch",
    "maxHp": 480,
    "attack": 32,
    "speed": 0.45,
    "aggroTiles": 7,
    "attackRangePx": 200,
    "attackCdMs": 2400,
    "attackKind": "magic_orb",
    "role": "magic",
    "level": 20,
    "preferredRangePx": 170,
    "projectileColorPrimary": "#c8a8ff",
    "projectileColorSecondary": "#3a1a4a"
  },
  "ashen_warlord": {
    "id": "ashen_warlord",
    "maxHp": 780,
    "attack": 38,
    "speed": 0.55,
    "aggroTiles": 6,
    "attackRangePx": 30,
    "attackCdMs": 1800,
    "attackKind": "lunge",
    "role": "melee",
    "level": 30
  },
  "mb_prism_dragon": {
    "id": "mb_prism_dragon",
    "maxHp": 1200,
    "attack": 65,
    "speed": 0.55,
    "aggroTiles": 8,
    "attackRangePx": 220,
    "attackCdMs": 2400,
    "attackKind": "fireball",
    "role": "magic",
    "rank": "mini_boss",
    "level": 40,
    "preferredRangePx": 180,
    "projectileColorPrimary": "#e0a8ff",
    "projectileColorSecondary": "#5ad8c8"
  },
  "mb_storm_titan": {
    "id": "mb_storm_titan",
    "maxHp": 1800,
    "attack": 70,
    "speed": 0.3,
    "aggroTiles": 6,
    "attackRangePx": 34,
    "attackCdMs": 2400,
    "attackKind": "slam",
    "role": "tank",
    "rank": "mini_boss",
    "level": 50
  },
  "mb_void_archon": {
    "id": "mb_void_archon",
    "maxHp": 2600,
    "attack": 125,
    "speed": 0.4,
    "aggroTiles": 8,
    "attackRangePx": 240,
    "attackCdMs": 2500,
    "attackKind": "magic_orb",
    "role": "magic",
    "rank": "mini_boss",
    "level": 60,
    "preferredRangePx": 210,
    "projectileColorPrimary": "#ff80c0",
    "projectileColorSecondary": "#3a1a5a"
  },
  "mb_bloodroot_colossus": {
    "id": "mb_bloodroot_colossus",
    "maxHp": 3800,
    "attack": 155,
    "speed": 0.28,
    "aggroTiles": 6,
    "attackRangePx": 40,
    "attackCdMs": 2600,
    "attackKind": "slam",
    "role": "tank",
    "rank": "mini_boss",
    "level": 70
  },
  "mb_dreadspire_wraith": {
    "id": "mb_dreadspire_wraith",
    "maxHp": 5000,
    "attack": 210,
    "speed": 0.5,
    "aggroTiles": 8,
    "attackRangePx": 260,
    "attackCdMs": 2500,
    "attackKind": "magic_orb",
    "role": "magic",
    "rank": "mini_boss",
    "level": 80,
    "preferredRangePx": 220,
    "projectileColorPrimary": "#d8a8ff",
    "projectileColorSecondary": "#3a1060"
  },
  "mb_obsidian_tyrant": {
    "id": "mb_obsidian_tyrant",
    "maxHp": 7000,
    "attack": 280,
    "speed": 0.45,
    "aggroTiles": 7,
    "attackRangePx": 40,
    "attackCdMs": 2200,
    "attackKind": "lunge",
    "role": "melee",
    "rank": "mini_boss",
    "level": 90
  },
  "wb_void_sovereign": {
    "id": "wb_void_sovereign",
    "maxHp": 12000,
    "attack": 260,
    "speed": 0.42,
    "aggroTiles": 10,
    "attackRangePx": 260,
    "attackCdMs": 2200,
    "attackKind": "magic_orb",
    "role": "magic",
    "rank": "mini_boss",
    "level": 100,
    "preferredRangePx": 220,
    "projectileColorPrimary": "#ff80e0",
    "projectileColorSecondary": "#3a1060"
  },
  "void_acolyte": {
    "id": "void_acolyte",
    "maxHp": 700,
    "attack": 135,
    "speed": 0.45,
    "aggroTiles": 8,
    "attackRangePx": 200,
    "attackCdMs": 2500,
    "attackKind": "magic_orb",
    "role": "magic",
    "level": 80,
    "preferredRangePx": 170,
    "projectileColorPrimary": "#c0a0ff",
    "projectileColorSecondary": "#3a1a6a"
  }
};

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

const FRONTIER_SPAWNS = [
  {
    "defId": "field_rat",
    "tileX": 6,
    "tileY": 36
  },
  {
    "defId": "field_rat",
    "tileX": 14,
    "tileY": 38
  },
  {
    "defId": "wisp_moth",
    "tileX": 8,
    "tileY": 32
  },
  {
    "defId": "wisp_moth",
    "tileX": 12,
    "tileY": 34
  },
  {
    "defId": "thorn_sprite",
    "tileX": 6,
    "tileY": 56
  },
  {
    "defId": "thorn_sprite",
    "tileX": 14,
    "tileY": 58
  },
  {
    "defId": "rock_turtle",
    "tileX": 10,
    "tileY": 62
  },
  {
    "defId": "rock_turtle",
    "tileX": 4,
    "tileY": 50,
    "elite": true
  },
  {
    "defId": "greenfield_king",
    "tileX": 10,
    "tileY": 70,
    "elite": true
  },
  {
    "defId": "field_rat",
    "tileX": 4,
    "tileY": 24
  },
  {
    "defId": "field_rat",
    "tileX": 17,
    "tileY": 26
  },
  {
    "defId": "wisp_moth",
    "tileX": 16,
    "tileY": 22
  },
  {
    "defId": "wisp_moth",
    "tileX": 6,
    "tileY": 14
  },
  {
    "defId": "thorn_sprite",
    "tileX": 4,
    "tileY": 64
  },
  {
    "defId": "thorn_sprite",
    "tileX": 18,
    "tileY": 66
  },
  {
    "defId": "rock_turtle",
    "tileX": 16,
    "tileY": 76
  },
  {
    "defId": "field_rat",
    "tileX": 12,
    "tileY": 80
  },
  {
    "defId": "bog_lurker",
    "tileX": 26,
    "tileY": 36
  },
  {
    "defId": "bog_lurker",
    "tileX": 34,
    "tileY": 38
  },
  {
    "defId": "fen_archer",
    "tileX": 28,
    "tileY": 32
  },
  {
    "defId": "fen_archer",
    "tileX": 32,
    "tileY": 34
  },
  {
    "defId": "marsh_caster",
    "tileX": 26,
    "tileY": 56
  },
  {
    "defId": "marsh_caster",
    "tileX": 34,
    "tileY": 58
  },
  {
    "defId": "mire_brute",
    "tileX": 30,
    "tileY": 62
  },
  {
    "defId": "bog_lurker",
    "tileX": 24,
    "tileY": 50,
    "elite": true
  },
  {
    "defId": "fen_witch",
    "tileX": 30,
    "tileY": 75,
    "elite": true
  },
  {
    "defId": "bog_lurker",
    "tileX": 22,
    "tileY": 28
  },
  {
    "defId": "bog_lurker",
    "tileX": 38,
    "tileY": 26
  },
  {
    "defId": "fen_archer",
    "tileX": 36,
    "tileY": 14
  },
  {
    "defId": "marsh_caster",
    "tileX": 22,
    "tileY": 12
  },
  {
    "defId": "mire_brute",
    "tileX": 36,
    "tileY": 78
  },
  {
    "defId": "bog_lurker",
    "tileX": 22,
    "tileY": 66
  },
  {
    "defId": "fen_archer",
    "tileX": 38,
    "tileY": 70
  },
  {
    "defId": "marsh_caster",
    "tileX": 28,
    "tileY": 82
  },
  {
    "defId": "ash_hound",
    "tileX": 46,
    "tileY": 36
  },
  {
    "defId": "ash_hound",
    "tileX": 54,
    "tileY": 38
  },
  {
    "defId": "cinder_archer",
    "tileX": 48,
    "tileY": 32
  },
  {
    "defId": "cinder_archer",
    "tileX": 52,
    "tileY": 34
  },
  {
    "defId": "ember_warlock",
    "tileX": 46,
    "tileY": 56
  },
  {
    "defId": "ember_warlock",
    "tileX": 54,
    "tileY": 58
  },
  {
    "defId": "magma_golem",
    "tileX": 50,
    "tileY": 62
  },
  {
    "defId": "cinder_archer",
    "tileX": 44,
    "tileY": 50,
    "elite": true
  },
  {
    "defId": "ashen_warlord",
    "tileX": 50,
    "tileY": 75,
    "elite": true
  },
  {
    "defId": "ash_hound",
    "tileX": 42,
    "tileY": 22
  },
  {
    "defId": "ash_hound",
    "tileX": 58,
    "tileY": 28
  },
  {
    "defId": "cinder_archer",
    "tileX": 56,
    "tileY": 14
  },
  {
    "defId": "ember_warlock",
    "tileX": 42,
    "tileY": 12
  },
  {
    "defId": "magma_golem",
    "tileX": 58,
    "tileY": 78
  },
  {
    "defId": "ash_hound",
    "tileX": 42,
    "tileY": 68
  },
  {
    "defId": "cinder_archer",
    "tileX": 58,
    "tileY": 70
  },
  {
    "defId": "ember_warlock",
    "tileX": 48,
    "tileY": 82
  },
  {
    "defId": "shard_stalker",
    "tileX": 66,
    "tileY": 36
  },
  {
    "defId": "shard_stalker",
    "tileX": 74,
    "tileY": 38
  },
  {
    "defId": "prism_sniper",
    "tileX": 68,
    "tileY": 32
  },
  {
    "defId": "prism_sniper",
    "tileX": 72,
    "tileY": 34
  },
  {
    "defId": "crystal_seer",
    "tileX": 66,
    "tileY": 56
  },
  {
    "defId": "crystal_seer",
    "tileX": 74,
    "tileY": 58
  },
  {
    "defId": "geode_guard",
    "tileX": 70,
    "tileY": 62
  },
  {
    "defId": "crystal_seer",
    "tileX": 64,
    "tileY": 50,
    "elite": true
  },
  {
    "defId": "mb_prism_dragon",
    "tileX": 70,
    "tileY": 75
  },
  {
    "defId": "shard_stalker",
    "tileX": 62,
    "tileY": 24
  },
  {
    "defId": "shard_stalker",
    "tileX": 78,
    "tileY": 26
  },
  {
    "defId": "prism_sniper",
    "tileX": 76,
    "tileY": 14
  },
  {
    "defId": "crystal_seer",
    "tileX": 62,
    "tileY": 12
  },
  {
    "defId": "geode_guard",
    "tileX": 78,
    "tileY": 78
  },
  {
    "defId": "shard_stalker",
    "tileX": 62,
    "tileY": 68
  },
  {
    "defId": "prism_sniper",
    "tileX": 78,
    "tileY": 70
  },
  {
    "defId": "crystal_seer",
    "tileX": 68,
    "tileY": 82
  },
  {
    "defId": "storm_harpy",
    "tileX": 86,
    "tileY": 36
  },
  {
    "defId": "storm_harpy",
    "tileX": 94,
    "tileY": 38
  },
  {
    "defId": "gale_archer",
    "tileX": 88,
    "tileY": 32
  },
  {
    "defId": "gale_archer",
    "tileX": 92,
    "tileY": 34
  },
  {
    "defId": "thunder_shaman",
    "tileX": 86,
    "tileY": 56
  },
  {
    "defId": "thunder_shaman",
    "tileX": 94,
    "tileY": 58
  },
  {
    "defId": "rime_giant",
    "tileX": 90,
    "tileY": 62
  },
  {
    "defId": "gale_archer",
    "tileX": 84,
    "tileY": 50,
    "elite": true
  },
  {
    "defId": "mb_storm_titan",
    "tileX": 90,
    "tileY": 75
  },
  {
    "defId": "storm_harpy",
    "tileX": 82,
    "tileY": 22
  },
  {
    "defId": "storm_harpy",
    "tileX": 98,
    "tileY": 28
  },
  {
    "defId": "gale_archer",
    "tileX": 96,
    "tileY": 14
  },
  {
    "defId": "thunder_shaman",
    "tileX": 82,
    "tileY": 12
  },
  {
    "defId": "rime_giant",
    "tileX": 98,
    "tileY": 78
  },
  {
    "defId": "storm_harpy",
    "tileX": 82,
    "tileY": 68
  },
  {
    "defId": "gale_archer",
    "tileX": 98,
    "tileY": 70
  },
  {
    "defId": "thunder_shaman",
    "tileX": 88,
    "tileY": 82
  },
  {
    "defId": "void_wraith",
    "tileX": 106,
    "tileY": 36
  },
  {
    "defId": "void_wraith",
    "tileX": 114,
    "tileY": 38
  },
  {
    "defId": "eye_of_void",
    "tileX": 108,
    "tileY": 32
  },
  {
    "defId": "eye_of_void",
    "tileX": 112,
    "tileY": 34
  },
  {
    "defId": "astral_caster",
    "tileX": 106,
    "tileY": 56
  },
  {
    "defId": "astral_caster",
    "tileX": 114,
    "tileY": 58
  },
  {
    "defId": "voidlord",
    "tileX": 110,
    "tileY": 62
  },
  {
    "defId": "astral_caster",
    "tileX": 104,
    "tileY": 50,
    "elite": true
  },
  {
    "defId": "mb_void_archon",
    "tileX": 110,
    "tileY": 78
  },
  {
    "defId": "void_wraith",
    "tileX": 102,
    "tileY": 24
  },
  {
    "defId": "void_wraith",
    "tileX": 118,
    "tileY": 26
  },
  {
    "defId": "eye_of_void",
    "tileX": 116,
    "tileY": 14
  },
  {
    "defId": "astral_caster",
    "tileX": 102,
    "tileY": 12
  },
  {
    "defId": "voidlord",
    "tileX": 118,
    "tileY": 70
  },
  {
    "defId": "void_wraith",
    "tileX": 102,
    "tileY": 68
  },
  {
    "defId": "eye_of_void",
    "tileX": 118,
    "tileY": 82
  },
  {
    "defId": "astral_caster",
    "tileX": 108,
    "tileY": 84
  },
  {
    "defId": "thornback_stalker",
    "tileX": 126,
    "tileY": 36
  },
  {
    "defId": "thornback_stalker",
    "tileX": 134,
    "tileY": 38
  },
  {
    "defId": "ember_wolf",
    "tileX": 128,
    "tileY": 32
  },
  {
    "defId": "ember_wolf",
    "tileX": 132,
    "tileY": 34
  },
  {
    "defId": "ironhide_boar",
    "tileX": 130,
    "tileY": 62
  },
  {
    "defId": "ironhide_boar",
    "tileX": 138,
    "tileY": 58
  },
  {
    "defId": "darkroot_shaman",
    "tileX": 126,
    "tileY": 56
  },
  {
    "defId": "darkroot_shaman",
    "tileX": 134,
    "tileY": 78
  },
  {
    "defId": "thornback_stalker",
    "tileX": 124,
    "tileY": 50,
    "elite": true
  },
  {
    "defId": "ember_wolf",
    "tileX": 122,
    "tileY": 22
  },
  {
    "defId": "ember_wolf",
    "tileX": 138,
    "tileY": 28
  },
  {
    "defId": "thornback_stalker",
    "tileX": 136,
    "tileY": 14
  },
  {
    "defId": "darkroot_shaman",
    "tileX": 122,
    "tileY": 12
  },
  {
    "defId": "ironhide_boar",
    "tileX": 138,
    "tileY": 80
  },
  {
    "defId": "thornback_stalker",
    "tileX": 122,
    "tileY": 68
  },
  {
    "defId": "darkroot_shaman",
    "tileX": 128,
    "tileY": 84
  },
  {
    "defId": "mb_bloodroot_colossus",
    "tileX": 130,
    "tileY": 80
  },
  {
    "defId": "voidfang_panther",
    "tileX": 146,
    "tileY": 36
  },
  {
    "defId": "voidfang_panther",
    "tileX": 154,
    "tileY": 38
  },
  {
    "defId": "ashbone_archer",
    "tileX": 148,
    "tileY": 32
  },
  {
    "defId": "ashbone_archer",
    "tileX": 152,
    "tileY": 34
  },
  {
    "defId": "crystal_golem",
    "tileX": 150,
    "tileY": 62
  },
  {
    "defId": "crystal_golem",
    "tileX": 158,
    "tileY": 58
  },
  {
    "defId": "hexwing_caster",
    "tileX": 146,
    "tileY": 56
  },
  {
    "defId": "hexwing_caster",
    "tileX": 154,
    "tileY": 78
  },
  {
    "defId": "hexwing_caster",
    "tileX": 144,
    "tileY": 50,
    "elite": true
  },
  {
    "defId": "voidfang_panther",
    "tileX": 142,
    "tileY": 22
  },
  {
    "defId": "voidfang_panther",
    "tileX": 158,
    "tileY": 28
  },
  {
    "defId": "ashbone_archer",
    "tileX": 156,
    "tileY": 14
  },
  {
    "defId": "crystal_golem",
    "tileX": 142,
    "tileY": 12
  },
  {
    "defId": "hexwing_caster",
    "tileX": 158,
    "tileY": 80
  },
  {
    "defId": "voidfang_panther",
    "tileX": 142,
    "tileY": 68
  },
  {
    "defId": "ashbone_archer",
    "tileX": 148,
    "tileY": 84
  },
  {
    "defId": "mb_dreadspire_wraith",
    "tileX": 150,
    "tileY": 80
  },
  {
    "defId": "dreadhorn_beast",
    "tileX": 166,
    "tileY": 36
  },
  {
    "defId": "dreadhorn_beast",
    "tileX": 174,
    "tileY": 38
  },
  {
    "defId": "nightshade_rogue",
    "tileX": 168,
    "tileY": 32
  },
  {
    "defId": "nightshade_rogue",
    "tileX": 172,
    "tileY": 34
  },
  {
    "defId": "stormscale_drake",
    "tileX": 166,
    "tileY": 56
  },
  {
    "defId": "stormscale_drake",
    "tileX": 174,
    "tileY": 58
  },
  {
    "defId": "abyssal_mage",
    "tileX": 170,
    "tileY": 62
  },
  {
    "defId": "abyssal_mage",
    "tileX": 178,
    "tileY": 78
  },
  {
    "defId": "stormscale_drake",
    "tileX": 164,
    "tileY": 50,
    "elite": true
  },
  {
    "defId": "dreadhorn_beast",
    "tileX": 162,
    "tileY": 22
  },
  {
    "defId": "nightshade_rogue",
    "tileX": 178,
    "tileY": 28
  },
  {
    "defId": "stormscale_drake",
    "tileX": 176,
    "tileY": 14
  },
  {
    "defId": "abyssal_mage",
    "tileX": 162,
    "tileY": 12
  },
  {
    "defId": "dreadhorn_beast",
    "tileX": 178,
    "tileY": 80
  },
  {
    "defId": "nightshade_rogue",
    "tileX": 162,
    "tileY": 68
  },
  {
    "defId": "abyssal_mage",
    "tileX": 168,
    "tileY": 84
  },
  {
    "defId": "mb_obsidian_tyrant",
    "tileX": 170,
    "tileY": 80
  },
  {
    "defId": "obsidian_reaver",
    "tileX": 184,
    "tileY": 36
  },
  {
    "defId": "obsidian_reaver",
    "tileX": 188,
    "tileY": 38
  },
  {
    "defId": "ancient_treant",
    "tileX": 186,
    "tileY": 32
  },
  {
    "defId": "ancient_treant",
    "tileX": 184,
    "tileY": 56
  },
  {
    "defId": "bloodmoon_wraith",
    "tileX": 188,
    "tileY": 56
  },
  {
    "defId": "bloodmoon_wraith",
    "tileX": 186,
    "tileY": 62
  },
  {
    "defId": "riftborn_guardian",
    "tileX": 184,
    "tileY": 22
  },
  {
    "defId": "riftborn_guardian",
    "tileX": 188,
    "tileY": 70
  },
  {
    "defId": "bloodmoon_wraith",
    "tileX": 182,
    "tileY": 50,
    "elite": true
  },
  {
    "defId": "obsidian_reaver",
    "tileX": 182,
    "tileY": 28
  },
  {
    "defId": "ancient_treant",
    "tileX": 188,
    "tileY": 14
  },
  {
    "defId": "riftborn_guardian",
    "tileX": 182,
    "tileY": 12
  },
  {
    "defId": "obsidian_reaver",
    "tileX": 186,
    "tileY": 78
  },
  {
    "defId": "bloodmoon_wraith",
    "tileX": 184,
    "tileY": 84
  },
  {
    "defId": "wb_void_sovereign",
    "tileX": 195,
    "tileY": 86
  },
  {
    "defId": "void_acolyte",
    "tileX": 193,
    "tileY": 86
  },
  {
    "defId": "void_acolyte",
    "tileX": 197,
    "tileY": 86
  },
  {
    "defId": "void_acolyte",
    "tileX": 195,
    "tileY": 84
  },
  {
    "defId": "void_acolyte",
    "tileX": 195,
    "tileY": 88
  }
];

const RANK_SCALE = {
  normal:    { hp: 1.0, atk: 1.0 },
  elite:     { hp: 2.2, atk: 1.5 },
  mini_boss: { hp: 1.0, atk: 1.0 },
};

function getEffectiveDef(defId, rank) {
  const base = MONSTER_DEFS[defId];
  if (!base) return null;
  const r = rank || 'normal';
  if (r === 'normal') return base;
  if (r === 'mini_boss') return { ...base, rank: r };
  const s = RANK_SCALE[r];
  return { ...base, rank: r, maxHp: Math.round(base.maxHp * s.hp), attack: Math.round(base.attack * s.atk) };
}

module.exports = { TILE_SIZE, MONSTER_DEFS, WILDWOOD_SPAWNS, FRONTIER_SPAWNS, getEffectiveDef };
