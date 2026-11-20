/* "Who wins the lane?" daily set. Shared by the quiz and the homepage preview,
   so both always show the same matchups. Same set for everyone on a UTC date. */
(function(){
  function hashStr(s){ let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
  function mulberry32(a){ return function(){ a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  // q: {role, a, b, wrA, games, band, flip}  (flip puts b on the left)
  function toQ(row, rng){ const [role, a, b, wrA, games, band] = row; return {role, a, b, wrA, games, band, flip: rng() < 0.5}; }
  // 5 questions, one per lane (lane order shuffled daily): 2 easy, 2 medium, 1 hard, no champion twice
  function dailyQuestions(data, date){
    const rng = mulberry32(hashStr("matchups:" + date));
    const lanes = ["top","jungle","mid","adc","support"];
    for (let i = lanes.length - 1; i > 0; i--) { const j = Math.floor(rng() * (i + 1)); [lanes[i], lanes[j]] = [lanes[j], lanes[i]]; }
    const bands = [0,0,1,1,2], used = new Set(), out = [];
    bands.forEach((band, i) => {
      const fits = r => r[5] === band && !used.has(r[1]) && !used.has(r[2]);
      let pool = data.q.filter(r => r[0] === lanes[i] && fits(r));
      if (!pool.length) pool = data.q.filter(fits);
      if (!pool.length) pool = data.q;
      const row = pool[Math.floor(rng() * pool.length)];
      used.add(row[1]); used.add(row[2]);
      out.push(toQ(row, rng));
    });
    return out;
  }
  // saved results record how many questions the set had, so older 10-question results aren't mixed in
  window.WWL = {dailyQuestions, toQ, COUNT: 5};
})();
