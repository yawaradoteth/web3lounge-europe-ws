// Auto-curated subset of client skill cooldowns. Mirror of src/game/skills.ts.
// Used by the server to validate skill cast cadence (Phase 2). If a skill id
// is missing here we fall back to FALLBACK_CD_MS so unknown / weapon skills
// are still gated, just less strictly.
//
// Keep these in sync with the client. We only need cooldownMs (and basic
// cooldowns for basic attacks) — visuals/damage stay client-driven for now.

const FALLBACK_CD_MS = 1000;
const BASIC_FALLBACK_CD_MS = 700;
// Permit a small grace window to absorb clock skew + RTT jitter so honest
// players aren't punished. 15% of the cooldown, capped between 50ms and 400ms.
const COOLDOWN_GRACE_FRAC = 0.15;
const MIN_GRACE_MS = 50;
const MAX_GRACE_MS = 400;

const SKILL_COOLDOWNS = {
  // Swordsman
  sw_powerslash: 1500, sw_crushingblow: 6000, sw_whirlwind: 9000, sw_charge: 6000, sw_battlecry: 20000,
  // Archer
  ar_powershot: 1400, ar_piercing: 6000, ar_rain: 12000, ar_tumble: 5000, ar_eagle: 20000,
  // Mage
  mg_fireball: 1500, mg_lightning: 5500, mg_meteor: 12000, mg_arcanestep: 6000, mg_arcanepower: 22000,
  // Healer
  hl_holybolt: 1500, hl_smite: 6000, hl_sanctuary: 9000, hl_divinestep: 6000, hl_blessing: 22000,
  // Thief
  th_backstab: 1400, th_assassinate: 6500, th_fanofknives: 7000, th_shadowdash: 4500, th_vanish: 20000,
  // Basic attacks
  basic_sword: 1000, basic_bolt: 1538, basic_arrow: 870, basic_spark: 1333, basic_dagger: 740,
};

function getCooldownMs(skillId, kind) {
  const cd = SKILL_COOLDOWNS[skillId];
  if (typeof cd === 'number') return cd;
  // Weapon skills (id starts with `weaponskill:`) and unknown ids — use a
  // reasonable default. Basic attacks get a tighter floor since they spam.
  return kind === 'basic' ? BASIC_FALLBACK_CD_MS : FALLBACK_CD_MS;
}

function graceFor(cd) {
  return Math.max(MIN_GRACE_MS, Math.min(MAX_GRACE_MS, Math.floor(cd * COOLDOWN_GRACE_FRAC)));
}

module.exports = { SKILL_COOLDOWNS, getCooldownMs, graceFor };
