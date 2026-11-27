/* "Who wins the game?" daily set. Shared by the puzzle page and the daily archive builder,
   so both always pick the same games. Same set for everyone on a UTC date: easy, medium, hard. */
(function(){
  function hashStr(s){ let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
  function mulberry32(a){ return function(){ a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  const LAUNCH = "2026-11-20"; // Who wins the game? #1
  const dailyNumber = d => Math.max(1, Math.round((Date.parse(d + "T00:00:00Z") - Date.parse(LAUNCH + "T00:00:00Z")) / 864e5) + 1);
  // row: [10 champion indexes (blue top..sup, red top..sup), blue win %, lane scores x10 (top jg mid bot), why[], [blue style, red style], band]
  const toG = (data, row, i) => ({i, blue: row[0].slice(0, 5).map(n => data.names[n]), red: row[0].slice(5).map(n => data.names[n]),
    p: row[1], lanes: row[2], why: row[3], styles: row[4].map(s => data.styles[s]), band: row[5]});
  function daily(data, date){
    const rng = mulberry32(hashStr("teams:" + date)), out = [], used = new Set();
    [0, 1, 2].forEach(band => {   // three games a day: easy, medium, hard
      const pool = data.g.map((r, i) => [r, i]).filter(([r, i]) => r[5] === band && !used.has(i));
      const [row, i] = pool[Math.floor(rng() * pool.length)];
      used.add(i); out.push(toG(data, row, i));
    });
    return out;
  }
  window.TeamsDaily = {daily, toG, dailyNumber, LAUNCH};
})();
