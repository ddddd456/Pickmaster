// ============================================================
//  data.js — все герои Dota 2 (патч 7.41)
// ============================================================

export const ATTRIBUTES = {
  str: { label: 'Сила', color: '#ff4d4d', icon: 'str' },
  agi: { label: 'Ловкость', color: '#3ddc84', icon: 'agi' },
  int: { label: 'Интеллект', color: '#4d9fff', icon: 'int' },
  uni: { label: 'Универсальный', color: '#b06bff', icon: 'uni' }
};

export const POSITIONS = {
  1: { label: 'Позиция 1', short: 'Керри', role: 'Carry' },
  2: { label: 'Позиция 2', short: 'Мид', role: 'Mid' },
  3: { label: 'Позиция 3', short: 'Оффлейн', role: 'Offlane' },
  4: { label: 'Позиция 4', short: 'Роуминг-саппорт', role: 'Soft Support' },
  5: { label: 'Позиция 5', short: 'Хард-саппорт', role: 'Hard Support' }
};

export const DAMAGE_TYPES = {
  magical: 'Магический',
  physical: 'Физический',
  pure: 'Чистый',
  none: '—'
};

// ============ ВСЕ ГЕРОИ (124) ============
export const HEROES = [
  // ---- STRENGTH ----
  { id: 'axe', name: 'Axe', attr: 'str', positions: [], attackType: 'melee' },
  { id: 'beastmaster', name: 'Beastmaster', attr: 'str', positions: [], attackType: 'melee' },
  { id: 'brewmaster', name: 'Brewmaster', attr: 'str', positions: [], attackType: 'melee' },
  { id: 'bristleback', name: 'Bristleback', attr: 'str', positions: [], attackType: 'melee' },
  { id: 'centaur', name: 'Centaur Warrunner', attr: 'str', positions: [], attackType: 'melee' },
  { id: 'chaos_knight', name: 'Chaos Knight', attr: 'str', positions: [], attackType: 'melee' },
  { id: 'dawnbreaker', name: 'Dawnbreaker', attr: 'str', positions: [], attackType: 'melee' },
  { id: 'doom', name: 'Doom', attr: 'str', positions: [], attackType: 'melee' },
  { id: 'dragon_knight', name: 'Dragon Knight', attr: 'str', positions: [], attackType: 'melee' },
  { id: 'earth_spirit', name: 'Earth Spirit', attr: 'str', positions: [], attackType: 'melee' },
  { id: 'earthshaker', name: 'Earthshaker', attr: 'str', positions: [], attackType: 'melee' },
  { id: 'elder_titan', name: 'Elder Titan', attr: 'str', positions: [], attackType: 'melee' },
  { id: 'huskar', name: 'Huskar', attr: 'str', positions: [], attackType: 'ranged' },
  { id: 'kunkka', name: 'Kunkka', attr: 'str', positions: [], attackType: 'melee' },
  { id: 'legion_commander', name: 'Legion Commander', attr: 'str', positions: [], attackType: 'melee' },
  { id: 'lifestealer', name: 'Lifestealer', attr: 'str', positions: [], attackType: 'melee' },
  { id: 'lycan', name: 'Lycan', attr: 'str', positions: [], attackType: 'melee' },
  { id: 'mars', name: 'Mars', attr: 'str', positions: [], attackType: 'melee' },
  { id: 'night_stalker', name: 'Night Stalker', attr: 'str', positions: [], attackType: 'melee' },
  { id: 'omniknight', name: 'Omniknight', attr: 'str', positions: [], attackType: 'melee' },
  { id: 'phoenix', name: 'Phoenix', attr: 'str', positions: [], attackType: 'ranged' },
  { id: 'pudge', name: 'Pudge', attr: 'str', positions: [], attackType: 'melee' },
  { id: 'pugna', name: 'Pugna', attr: 'str', positions: [], attackType: 'ranged' },
  { id: 'sand_king', name: 'Sand King', attr: 'str', positions: [], attackType: 'melee' },
  { id: 'slardar', name: 'Slardar', attr: 'str', positions: [], attackType: 'melee' },
  { id: 'snapfire', name: 'Snapfire', attr: 'str', positions: [], attackType: 'ranged' },
  { id: 'spirit_breaker', name: 'Spirit Breaker', attr: 'str', positions: [], attackType: 'melee' },
  { id: 'sven', name: 'Sven', attr: 'str', positions: [], attackType: 'melee' },
  { id: 'tidehunter', name: 'Tidehunter', attr: 'str', positions: [], attackType: 'melee' },
  { id: 'timbersaw', name: 'Timbersaw', attr: 'str', positions: [], attackType: 'melee' },
  { id: 'tiny', name: 'Tiny', attr: 'str', positions: [], attackType: 'melee' },
  { id: 'treant', name: 'Treant Protector', attr: 'str', positions: [], attackType: 'melee' },
  { id: 'tusk', name: 'Tusk', attr: 'str', positions: [], attackType: 'melee' },
  { id: 'underlord', name: 'Underlord', attr: 'str', positions: [], attackType: 'melee' },
  { id: 'undying', name: 'Undying', attr: 'str', positions: [], attackType: 'melee' },
  { id: 'wraith_king', name: 'Wraith King', attr: 'str', positions: [], attackType: 'melee' },

  // ---- AGILITY ----
  { id: 'anti_mage', name: 'Anti-Mage', attr: 'agi', positions: [], attackType: 'melee' },
  { id: 'arc_warden', name: 'Arc Warden', attr: 'agi', positions: [], attackType: 'ranged' },
  { id: 'bloodseeker', name: 'Bloodseeker', attr: 'agi', positions: [], attackType: 'melee' },
  { id: 'bounty_hunter', name: 'Bounty Hunter', attr: 'agi', positions: [], attackType: 'melee' },
  { id: 'broodmother', name: 'Broodmother', attr: 'agi', positions: [], attackType: 'melee' },
  { id: 'clinkz', name: 'Clinkz', attr: 'agi', positions: [], attackType: 'ranged' },
  { id: 'drow_ranger', name: 'Drow Ranger', attr: 'agi', positions: [], attackType: 'ranged' },
  { id: 'ember_spirit', name: 'Ember Spirit', attr: 'agi', positions: [], attackType: 'melee' },
  { id: 'faceless_void', name: 'Faceless Void', attr: 'agi', positions: [], attackType: 'melee' },
  { id: 'gyrocopter', name: 'Gyrocopter', attr: 'agi', positions: [], attackType: 'ranged' },
  { id: 'hoodwink', name: 'Hoodwink', attr: 'agi', positions: [], attackType: 'ranged' },
  { id: 'juggernaut', name: 'Juggernaut', attr: 'agi', positions: [], attackType: 'melee' },
  { id: 'lone_druid', name: 'Lone Druid', attr: 'agi', positions: [], attackType: 'ranged' },
  { id: 'luna', name: 'Luna', attr: 'agi', positions: [], attackType: 'ranged' },
  { id: 'medusa', name: 'Medusa', attr: 'agi', positions: [], attackType: 'ranged' },
  { id: 'meepo', name: 'Meepo', attr: 'agi', positions: [], attackType: 'melee' },
  { id: 'mirana', name: 'Mirana', attr: 'agi', positions: [], attackType: 'ranged' },
  { id: 'monkey_king', name: 'Monkey King', attr: 'agi', positions: [], attackType: 'melee' },
  { id: 'morphling', name: 'Morphling', attr: 'agi', positions: [], attackType: 'ranged' },
  { id: 'naga_siren', name: 'Naga Siren', attr: 'agi', positions: [], attackType: 'melee' },
  { id: 'nyx_assassin', name: 'Nyx Assassin', attr: 'agi', positions: [], attackType: 'melee' },
  { id: 'pangolier', name: 'Pangolier', attr: 'agi', positions: [], attackType: 'melee' },
  { id: 'phantom_assassin', name: 'Phantom Assassin', attr: 'agi', positions: [], attackType: 'melee' },
  { id: 'phantom_lancer', name: 'Phantom Lancer', attr: 'agi', positions: [], attackType: 'melee' },
  { id: 'razor', name: 'Razor', attr: 'agi', positions: [], attackType: 'ranged' },
  { id: 'riki', name: 'Riki', attr: 'agi', positions: [], attackType: 'melee' },
  { id: 'shadow_fiend', name: 'Shadow Fiend', attr: 'agi', positions: [], attackType: 'ranged' },
  { id: 'slark', name: 'Slark', attr: 'agi', positions: [], attackType: 'melee' },
  { id: 'sniper', name: 'Sniper', attr: 'agi', positions: [], attackType: 'ranged' },
  { id: 'spectre', name: 'Spectre', attr: 'agi', positions: [], attackType: 'melee' },
  { id: 'templar_assassin', name: 'Templar Assassin', attr: 'agi', positions: [], attackType: 'ranged' },
  { id: 'terrorblade', name: 'Terrorblade', attr: 'agi', positions: [], attackType: 'melee' },
  { id: 'troll_warlord', name: 'Troll Warlord', attr: 'agi', positions: [], attackType: 'ranged' },
  { id: 'ursa', name: 'Ursa', attr: 'agi', positions: [], attackType: 'melee' },
  { id: 'vengeful_spirit', name: 'Vengeful Spirit', attr: 'agi', positions: [], attackType: 'ranged' },
  { id: 'venomancer', name: 'Venomancer', attr: 'agi', positions: [], attackType: 'ranged' },
  { id: 'viper', name: 'Viper', attr: 'agi', positions: [], attackType: 'ranged' },
  { id: 'weaver', name: 'Weaver', attr: 'agi', positions: [], attackType: 'ranged' },
  { id: 'windranger', name: 'Windranger', attr: 'agi', positions: [], attackType: 'ranged' },

  // ---- INTELLIGENCE ----
  { id: 'ancient_apparition', name: 'Ancient Apparition', attr: 'int', positions: [], attackType: 'ranged' },
  { id: 'bane', name: 'Bane', attr: 'int', positions: [], attackType: 'ranged' },
  { id: 'batrider', name: 'Batrider', attr: 'int', positions: [], attackType: 'ranged' },
  { id: 'chen', name: 'Chen', attr: 'int', positions: [], attackType: 'ranged' },
  { id: 'crystal_maiden', name: 'Crystal Maiden', attr: 'int', positions: [], attackType: 'ranged' },
  { id: 'dark_seer', name: 'Dark Seer', attr: 'int', positions: [], attackType: 'melee' },
  { id: 'dark_willow', name: 'Dark Willow', attr: 'int', positions: [], attackType: 'ranged' },
  { id: 'dazzle', name: 'Dazzle', attr: 'int', positions: [], attackType: 'ranged' },
  { id: 'death_prophet', name: 'Death Prophet', attr: 'int', positions: [], attackType: 'ranged' },
  { id: 'disruptor', name: 'Disruptor', attr: 'int', positions: [], attackType: 'ranged' },
  { id: 'enchantress', name: 'Enchantress', attr: 'int', positions: [], attackType: 'ranged' },
  { id: 'enigma', name: 'Enigma', attr: 'int', positions: [], attackType: 'ranged' },
  { id: 'grimstroke', name: 'Grimstroke', attr: 'int', positions: [], attackType: 'ranged' },
  { id: 'invoker', name: 'Invoker', attr: 'int', positions: [], attackType: 'ranged' },
  { id: 'jakiro', name: 'Jakiro', attr: 'int', positions: [], attackType: 'ranged' },
  { id: 'keeper_of_the_light', name: 'Keeper of the Light', attr: 'int', positions: [], attackType: 'ranged' },
  { id: 'leshrac', name: 'Leshrac', attr: 'int', positions: [], attackType: 'ranged' },
  { id: 'lich', name: 'Lich', attr: 'int', positions: [], attackType: 'ranged' },
  { id: 'lina', name: 'Lina', attr: 'int', positions: [], attackType: 'ranged' },
  { id: 'lion', name: 'Lion', attr: 'int', positions: [], attackType: 'ranged' },
  { id: 'nature_prophet', name: 'Nature Prophet', attr: 'int', positions: [], attackType: 'ranged' },
  { id: 'necrophos', name: 'Necrophos', attr: 'int', positions: [], attackType: 'ranged' },
  { id: 'ogre_magi', name: 'Ogre Magi', attr: 'int', positions: [], attackType: 'melee' },
  { id: 'oracle', name: 'Oracle', attr: 'int', positions: [], attackType: 'ranged' },
  { id: 'outworld_destroyer', name: 'Outworld Destroyer', attr: 'int', positions: [], attackType: 'ranged' },
  { id: 'queen_of_pain', name: 'Queen of Pain', attr: 'int', positions: [], attackType: 'ranged' },
  { id: 'rubick', name: 'Rubick', attr: 'int', positions: [], attackType: 'ranged' },
  { id: 'shadow_demon', name: 'Shadow Demon', attr: 'int', positions: [], attackType: 'ranged' },
  { id: 'shadow_shaman', name: 'Shadow Shaman', attr: 'int', positions: [], attackType: 'ranged' },
  { id: 'silencer', name: 'Silencer', attr: 'int', positions: [], attackType: 'ranged' },
  { id: 'skywrath_mage', name: 'Skywrath Mage', attr: 'int', positions: [], attackType: 'ranged' },
  { id: 'storm_spirit', name: 'Storm Spirit', attr: 'int', positions: [], attackType: 'ranged' },
  { id: 'techies', name: 'Techies', attr: 'int', positions: [], attackType: 'ranged' },
  { id: 'tinker', name: 'Tinker', attr: 'int', positions: [], attackType: 'ranged' },
  { id: 'visage', name: 'Visage', attr: 'int', positions: [], attackType: 'ranged' },
  { id: 'void_spirit', name: 'Void Spirit', attr: 'int', positions: [], attackType: 'melee' },
  { id: 'warlock', name: 'Warlock', attr: 'int', positions: [], attackType: 'ranged' },
  { id: 'witch_doctor', name: 'Witch Doctor', attr: 'int', positions: [], attackType: 'ranged' },
  { id: 'zeus', name: 'Zeus', attr: 'int', positions: [], attackType: 'ranged' },

  // ---- UNIVERSAL ----
  { id: 'abaddon', name: 'Abaddon', attr: 'uni', positions: [], attackType: 'melee' },
  { id: 'alchemist', name: 'Alchemist', attr: 'uni', positions: [], attackType: 'melee' },
  { id: 'clockwerk', name: 'Clockwerk', attr: 'uni', positions: [], attackType: 'melee' },
  { id: 'muerta', name: 'Muerta', attr: 'uni', positions: [], attackType: 'ranged' },
  { id: 'primal_beast', name: 'Primal Beast', attr: 'uni', positions: [], attackType: 'melee' },
  { id: 'io', name: 'Io', attr: 'uni', positions: [], attackType: 'ranged' },
  { id: 'magnus', name: 'Magnus', attr: 'uni', positions: [], attackType: 'melee' },
  { id: 'marci', name: 'Marci', attr: 'uni', positions: [], attackType: 'melee' },

];

// Вспомогательные функции
export function getHeroById(id) {
  return HEROES.find(h => h.id === id);
}

export function getHeroesByPosition(pos) {
  return HEROES.filter(h => h.positions.includes(pos));
}