/* Counter pick's daily enemy. Shared by the game and the homepage, so both always show the same enemy.
   The daily walks through a fixed shuffled rotation, so no enemy repeats until every one has had a day.
   Only enemies whose best counter leads the next one by 0.5+ points are used, so #1 isn't a coin flip. */
(function(){
  const LAUNCH = "2026-11-20"; // Counter pick #1
  function hashStr(s){ let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
  function mulberry32(a){ return function(){ a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  const dailyNumber = d => Math.max(1, Math.round((Date.parse(d + "T00:00:00Z") - Date.parse(LAUNCH + "T00:00:00Z")) / 864e5) + 1);
  // data.c[role][enemyIndex] = [tier, [[championIndex, winRate x10, games], ...best first]]
  function pairs(data){
    const out = [];
    for (const role in data.c) for (const e in data.c[role]) {
      const opts = data.c[role][e][1];
      out.push({key: [role, e], clear: opts[0][1] - opts[1][1] >= 5});
    }
    return out;
  }
  function puzzle(data, [role, e]){
    const [tier, opts] = data.c[role][e];
    return {role, enemy: data.names[e], tier, opts: opts.map(([p, wr, g], i) => ({name: data.names[p], wr: wr / 10, games: g, rank: i + 1}))};
  }
  function daily(data, date){
    const rot = pairs(data).filter(p => p.clear), rng = mulberry32(hashStr("counter-rotation"));
    for (let i = rot.length - 1; i > 0; i--) { const j = Math.floor(rng() * (i + 1)); [rot[i], rot[j]] = [rot[j], rot[i]]; }
    return puzzle(data, rot[(dailyNumber(date) - 1) % rot.length].key);
  }
  function random(data){ const all = pairs(data); return puzzle(data, all[Math.floor(Math.random() * all.length)].key); }
  window.CounterDaily = {daily, random, dailyNumber, LAUNCH};
})();
