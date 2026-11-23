/* Counter pick's daily rounds. Shared by the game and the homepage, so both always show the same enemies.
   Five rounds a day, one per lane. Each lane walks through its own fixed shuffled rotation of enemies,
   so an enemy doesn't come back in that lane until every other one has had a day. */
(function(){
  const LAUNCH = "2026-11-20"; // Counter pick #1
  const LANES = ["top", "jungle", "mid", "adc", "support"];
  function hashStr(s){ let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
  function mulberry32(a){ return function(){ a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  const dailyNumber = d => Math.max(1, Math.round((Date.parse(d + "T00:00:00Z") - Date.parse(LAUNCH + "T00:00:00Z")) / 864e5) + 1);
  // data.c[role][enemyIndex] = [tier, [[championIndex, winRate x10, games], ...best first]]
  function puzzle(data, role, e){
    const [tier, opts] = data.c[role][e], enemy = data.names[e];
    // everyone who plays this lane can be picked; only some have enough games against this enemy to be ranked
    const lane = (data.lanes && data.lanes[role] ? data.lanes[role].map(i => data.names[i]) : opts.map(o => data.names[o[0]])).filter(n => n !== enemy);
    return {role, enemy, tier, lane, opts: opts.map(([p, wr, g], i) => ({name: data.names[p], wr: wr / 10, games: g, rank: i + 1}))};
  }
  function rotation(data, role){
    const list = Object.keys(data.c[role]).sort((a, b) => a - b), rng = mulberry32(hashStr("counter-" + role));
    for (let i = list.length - 1; i > 0; i--) { const j = Math.floor(rng() * (i + 1)); [list[i], list[j]] = [list[j], list[i]]; }
    return list;
  }
  function daily(data, date){
    const n = dailyNumber(date) - 1;
    return LANES.map(role => { const rot = rotation(data, role); return puzzle(data, role, rot[n % rot.length]); });
  }
  function random(data){
    return LANES.map(role => { const keys = Object.keys(data.c[role]); return puzzle(data, role, keys[Math.floor(Math.random() * keys.length)]); });
  }
  // Points for a pick, whichever is better:
  //   by place: 100 for the best counter, 10 fewer for each place below it (#4 = 70)
  //   by win rate: 100 minus 20 for every point of win rate behind the best counter
  // so a near-tie with #1 scores well, and so does a high place when #1 is an outlier.
  // A lane champion without enough games against the enemy counts as an even matchup (50%),
  // scored by win rate only and capped at 50, so a guess with no data never beats a proven counter.
  const EVEN_CAP = 50;
  function points(pz, name){
    const o = pz.opts.find(x => x.name === name), best = pz.opts[0];
    if (!o) return pz.lane.includes(name) ? Math.max(0, Math.min(EVEN_CAP, Math.round(100 - 20 * (best.wr - 50)))) : 0;
    const byPlace = 100 - 10 * (o.rank - 1), byRate = Math.round(100 - 20 * (best.wr - o.wr));
    return Math.max(0, Math.min(100, Math.max(byPlace, byRate)));
  }
  window.CounterDaily = {daily, random, points, dailyNumber, LAUNCH, ROUNDS: LANES.length};
})();
