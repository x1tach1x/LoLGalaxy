// Builds the data for "Who wins the game?" (teams/games.json) and "Counter pick" (counter/data.json)
// from the Draft's own model and matchup table, so all LaneLock games agree with each other.
//   node tools/build_new_games.mjs
// tools/update_data.py runs this automatically after new matchup data is loaded.
import fs from "node:fs";
import path from "node:path";
import { loadEngine, ROOT } from "./engine.mjs";

const E = loadEngine();
const ROLE_KEYS = E.ROLES.map(r => r.key);                 // top jungle mid adc support
const usable = n => E.CHAMPS[n] && !E.ESTIMATED.has(n);    // estimated champions get patched in the browser, so skip them
const ddId = n => E.SPECIAL_IDS[n] || n.replace(/[^A-Za-z0-9]/g, "");
const names = [], index = new Map();
const idx = n => { if (!index.has(n)) { index.set(n, names.length); names.push(n); } return index.get(n); };
const champsJson = () => Object.fromEntries(names.map(n => [n, [ddId(n), E.CLASS_NAME[E.CHAMPS[n].cls] || ""]]));
const write = (rel, obj) => { const f = path.join(ROOT, rel); fs.writeFileSync(f, JSON.stringify(obj)); return (fs.statSync(f).size / 1024).toFixed(0) + " KB"; };
const today = new Date().toISOString().slice(0, 10);

/* ---------------- Who wins the game? ---------------- */
// Realistic random teams (tier-weighted like the Draft's enemy picks), simulated with the Draft's model.
// Only clear-cut games are kept so the answer is learnable: the favourite has 62%+.
const rng = E.mulberry32(20261120);
function pick(pool, weight){
  const total = pool.reduce((t, n) => t + weight(n), 0);
  let x = rng() * total;
  for (const n of pool) { x -= weight(n); if (x <= 0) return n; }
  return pool[pool.length - 1];
}
function team(used){
  const t = {};
  for (const role of ROLE_KEYS) {
    const pool = E.POOL[role].filter(n => usable(n) && !used.has(n));
    t[role] = pick(pool, n => E.ENEMY_WEIGHT[E.ROLE_TIER[role][n]] || 1);
    used.add(t[role]);
  }
  return t;
}
const sideText = s => s
  .replace(/^Your /, "Blue's ").replace(/^Their /, "Red's ")
  .replace(/ their /g, " Red's ").replace(/ your /g, " Blue's ");
function strongest(reasons){
  const data = reasons.filter(r => r.data);
  const list = data.length ? data : reasons.filter(r => Math.abs(r.v) >= 0.5 && !/^Not enough ranked games/.test(r.t));
  return list.sort((a, b) => Math.abs(b.v) - Math.abs(a.v))[0];
}
const STYLES = ["Engage", "Poke", "Protect", "Pick", "Split"];
const LANE_WORD = {top: "top", jungle: "the jungle", mid: "mid", bot: "bot lane"};
const short = t => t.replace(/ of games against /, " vs ").replace(/ against /, " vs ")
  .replace(/ in (top|jungle|mid|bot|support|bot lane) \(/, " (").replace(/ games this patch\)/, " games)")
  .replace(/ in (top|jungle|mid|bot|support) this patch/, "");
const BAND_SIZE = 250, bands = [[], [], []];
let tries = 0;
while (bands.some(b => b.length < BAND_SIZE) && tries < 400000) {
  tries++;
  const used = new Set(), blue = team(used), red = team(used);
  const r = E.simulate(blue, red, (rng() * 2 ** 31) | 0);
  const p = Math.round(r.prob * 100), fav = Math.max(p, 100 - p);
  if (fav < 62) continue;
  const band = fav >= 76 ? 0 : fav >= 68 ? 1 : 2;
  if (bands[band].length >= BAND_SIZE) continue;
  const winner = p > 50 ? 1 : -1, sideName = v => v > 0 ? "Blue" : "Red";
  // one line per lane: the strongest reason, phrased with champion names
  const laneReasons = role => role === "bot"
    ? [...r.lanes.find(l => l.role === "adc").reasons, ...r.lanes.find(l => l.role === "support").reasons]
    : r.lanes.find(l => l.role === role).reasons;
  const laneLine = role => { const x = strongest(laneReasons(role)); return x ? short(x.t) : ""; };
  const W = {top: 1, jungle: 1.15, mid: 1.15, bot: 1.2};
  // everything the model adds up (positive = good for Blue), so the reveal shows what actually decided it
  const factors = [];
  for (const k of ["top", "jungle", "mid", "bot"]) {
    const u = r.units.find(x => x.key === k), v = 0.6 * W[k] * u.score;
    factors.push({v, t: `${sideName(v)} wins ${LANE_WORD[k]}. ${laneLine(k)}`.replace(/\. $/, ".")});
  }
  const synSum = a => a.reduce((t, x) => t + x.v, 0);
  const vSyn = 0.55 * (synSum(r.synP) - synSum(r.synE));
  if (vSyn) { const best = (vSyn > 0 ? r.synP : r.synE).slice().sort((a, b) => b.v - a.v)[0]; if (best) factors.push({v: vSyn, t: `${sideName(vSyn)} has a combo: ${best.t}.`}); }
  if (r.tri) factors.push({v: 0.55 * r.tri, t: sideText(r.triText)});
  const vComp = 0.55 * (r.sP.score - r.sE.score);
  if (Math.abs(vComp) >= 0.15) {
    const weak = vComp > 0 ? r.sE : r.sP, bad = weak.notes.find(n => n.bad);
    if (bad) factors.push({v: vComp, t: `${sideName(-vComp)}'s comp: ${bad.t.charAt(0).toLowerCase() + bad.t.slice(1)}.`});
  }
  const vLate = 0.55 * 0.35 * (r.sP.late - r.sE.late), vEarly = 0.6 * 0.25 * (r.sP.early - r.sE.early);
  if (vLate) factors.push({v: vLate, t: `${sideName(vLate)} scales better: ${Math.max(r.sP.late, r.sE.late)} late-game champions to ${Math.min(r.sP.late, r.sE.late)}.`});
  if (vEarly) factors.push({v: vEarly, t: `${sideName(vEarly)} is stronger early: ${Math.max(r.sP.early, r.sE.early)} early-game champions to ${Math.min(r.sP.early, r.sE.early)}.`});
  const why = factors.filter(f => Math.sign(f.v) === winner && Math.abs(f.v) >= 0.12)
    .sort((a, b) => Math.abs(b.v) - Math.abs(a.v)).slice(0, 3).map(f => f.t);
  if (!why.length) continue;
  const scores = ["top", "jungle", "mid", "bot"].map(k => Math.round(r.units.find(u => u.key === k).score * 10));
  bands[band].push([
    ROLE_KEYS.map(k => idx(blue[k])).concat(ROLE_KEYS.map(k => idx(red[k]))),
    p, scores, why, [STYLES.indexOf(r.sP.style), STYLES.indexOf(r.sE.style)], band
  ]);
}
const games = bands.flat();
console.log(`Who wins the game?: ${games.length} games (${bands.map(b => b.length).join("/")} easy/medium/hard) from ${tries} simulated`
  + ` -> teams/games.json (${write("teams/games.json", {source: E.MATCHUP_SOURCE, built: today, styles: STYLES, names, champs: champsJson(), g: games})})`);

/* ---------------- Counter pick ---------------- */
// For each lane and enemy: every champion played in that lane with enough games against the enemy,
// ranked by win rate. The daily answer is the #1 counter.
names.length = 0; index.clear();
const MIN_GAMES = 800, MIN_OPTIONS = 10;   // 800+ games keeps each win rate within about ±1.8 points
const counters = {};
let pairs = 0;
for (const role of ROLE_KEYS) {
  counters[role] = {};
  for (const enemy of E.POOL[role]) {
    const opts = [];
    for (const p of E.POOL[role]) {
      if (p === enemy) continue;
      const m = E.matchup(p, enemy, role);
      if (m && m.g >= MIN_GAMES) opts.push([p, Math.round((50 + m.e) * 10), m.g]);
    }
    if (opts.length < MIN_OPTIONS) continue;
    opts.sort((a, b) => b[1] - a[1] || b[2] - a[2]);
    // tier of the enemy decides how often it can be the daily (popular champions more often)
    counters[role][idx(enemy)] = [E.ROLE_TIER[role][enemy] || "U", opts.map(([p, wr, g]) => [idx(p), wr, g])];
    pairs++;
  }
}
console.log(`Counter pick: ${pairs} lane/enemy pairs with ${MIN_OPTIONS}+ counters (${MIN_GAMES}+ games each)`
  + ` -> counter/data.json (${write("counter/data.json", {source: E.MATCHUP_SOURCE, built: today, minGames: MIN_GAMES, names, champs: champsJson(), c: counters})})`);
