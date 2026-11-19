// Today's LaneLock enemy team, computed exactly the way the site does it.
// TIERS and ENEMY_WEIGHT are copied from play/index.html by tools/update_data.py: don't edit them here.

export const LAUNCH = "2026-11-11";
export const TIERS = {
  top: {
    "S+":"Darius,Sett",
    "S":"Aatrox,Garen,Malphite,Mordekaiser,Renekton,Shen,Teemo,Yone",
    "A":"Camille,Dr. Mundo,Fiora,Gangplank,Illaoi,Irelia,Jax,Jayce,Nasus,Ornn,Pantheon,Singed,Sion,Volibear,Yasuo,Yorick,Zaahen",
    "B":"Akali,Ambessa,Cho'Gath,Gnar,Gragas,Gwen,Heimerdinger,K'Sante,Kayle,Kennen,Kled,Olaf,Quinn,Riven,Tryndamere,Urgot",
    "C":"Tahm Kench",
    "U":"Rumble,Vayne,Trundle,Wukong,Poppy,Vladimir"
  },
  jungle: {
    "S+":"Kayn,Lee Sin,Master Yi,Viego,Warwick",
    "S":"Briar,Cho'Gath,Ekko,Graves,Hecarim,Jarvan IV,Kha'Zix,Lillia,Naafiri,Shaco,Shyvana,Sylas,Talon,Vi,Wukong",
    "A":"Amumu,Bel'Veth,Darius,Diana,Elise,Evelynn,Fiddlesticks,Kindred,Nidalee,Nocturne,Nunu & Willump,Qiyana,Rammus,Rengar,Sejuani,Taliyah,Udyr,Xin Zhao,Zac,Zyra",
    "B":"Aatrox,Ivern,Jax,Jayce,Karthus,Malphite,Maokai,Rek'Sai,Teemo,Trundle,Volibear,Zed",
    "U":"Gragas,Skarner,Poppy,Gwen,Brand"
  },
  mid: {
    "S+":"Ahri",
    "S":"Akali,Ekko,Fizz,Katarina,Lissandra,Locke,Lux,Malzahar,Sylas,Syndra,Veigar,Viktor,Vladimir,Yasuo,Yone,Zed",
    "A":"Akshan,Anivia,Annie,Aurora,Diana,Galio,Hwei,Irelia,Kassadin,LeBlanc,Orianna,Taliyah,Twisted Fate,Vex,Xerath,Zoe",
    "B":"Aurelion Sol,Azir,Brand,Cassiopeia,Malphite,Mel,Naafiri,Qiyana,Ryze,Sion,Swain,Talon,Vel'Koz",
    "U":"Neeko,Ziggs,Corki"
  },
  adc: {
    "S+":"Jhin",
    "S":"Jinx,Kai'Sa,Xayah",
    "A":"Aurelion Sol,Caitlyn,Miss Fortune,Smolder,Tristana,Yasuo,Yunara",
    "B":"Aphelios,Ashe,Ezreal,Kog'Maw,Lucian,Samira,Sivir,Swain,Twitch,Varus,Vayne,Vel'Koz,Zeri",
    "D":"Hwei",
    "U":"Draven,Kalista,Nilah,Ziggs,Corki"
  },
  support: {
    "S+":"Leona,Thresh",
    "S":"Alistar,Blitzcrank,Janna,Lulu,Lux,Nami,Nautilus,Pyke,Rakan,Rell,Senna,Seraphine",
    "A":"Braum,Karma,Milio,Morgana,Poppy,Sona,Soraka,Vel'Koz,Xerath,Yuumi,Zilean,Zyra",
    "B":"Bard,Brand,Galio,Maokai,Neeko,Pantheon,Renata Glasc,Shaco,Swain,Tahm Kench,Taric",
    "U":"Ashe,Hwei"
  }
};
export const ENEMY_WEIGHT = {"S+":1.7,"S":1.6,"A":1.45,"B":1.25,"C":1,"D":0.8,"U":0.75};
const WEIGHTS_FROM = "2026-11-20";
const ENEMY_WEIGHT_BEFORE_2026_11_20 = {"S+":3,"S":3,"A":2.5,"B":1.8,"C":1,"D":0.5,"U":0.6};

const ROLES = [["top", "Top"], ["jungle", "Jungle"], ["mid", "Mid"], ["adc", "Bot"], ["support", "Support"]];
const POOL = {}, ROLE_TIER = {};
for (const role in TIERS) {
  POOL[role] = []; ROLE_TIER[role] = {};
  for (const tier in TIERS[role]) TIERS[role][tier].split(",").forEach(n => { POOL[role].push(n); ROLE_TIER[role][n] = tier; });
}
function hashStr(s) { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
function mulberry32(a) { return function () { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
function weightedPick(pool, weightOf, rng) {
  const w = pool.map(weightOf); let x = rng() * w.reduce((a, b) => a + b, 0), i = 0;
  while (i < pool.length - 1 && x > w[i]) { x -= w[i]; i++; }
  return pool[i];
}

export function dailyNumber(date) {
  return Math.max(1, Math.round((Date.parse(date + "T00:00:00Z") - Date.parse(LAUNCH + "T00:00:00Z")) / 864e5) + 1);
}

// [[label, champion], ...] for the given UTC date
export function dailyEnemy(date) {
  const rng = mulberry32(hashStr("daily:" + date)), used = new Set();
  const W = date < WEIGHTS_FROM ? ENEMY_WEIGHT_BEFORE_2026_11_20 : ENEMY_WEIGHT;
  return ROLES.map(([k, label]) => {
    const pool = POOL[k].filter(n => !used.has(n));
    const pick = weightedPick(pool, n => W[ROLE_TIER[k][n]] || 1, rng);
    used.add(pick);
    return [label, pick];
  });
}
