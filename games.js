/* LaneLock's daily games, and today's progress in each one (read from this browser's saved results).
   Used by the results screens ("More daily games") so every game links to the others. */
(function(){
  const today = () => new Date().toISOString().slice(0, 10);
  const read = k => { try { return JSON.parse(localStorage.getItem(k)); } catch(e) { return null; } };
  const count = a => Array.isArray(a) ? a.length : 0;
  const right = a => Array.isArray(a) ? a.filter(Boolean).length : 0;
  // status(): {done, text}
  const GAMES = [
    {id: "draft", name: "Draft", href: "/play/", desc: "Counter today's five enemies.",
     status(){ const d = read("leaguesim:daily"); return d && d.date === today() && typeof d.win === "boolean"
       ? {done: true, text: d.win ? "You won today's draft" : "You lost today's draft"} : {done: false, text: "Today's draft is waiting"}; }},
    {id: "matchups", name: "Who wins the lane?", href: "/matchups/", desc: "Pick the winner of ten matchups.",
     status(){ const s = read("wwl:daily:" + today()), n = count(s && s.answers);
       return n >= 10 ? {done: true, text: `You scored ${right(s.answers)}/10 today`} : {done: false, text: n ? `${n} of 10 answered today` : "Ten matchups are ready"}; }},
    {id: "teams", name: "Who wins the game?", href: "/teams/", desc: "Two full teams. Pick the one that wins.",
     status(){ const s = read("wwg:daily:" + today()), n = count(s && s.answers);
       return n >= 5 ? {done: true, text: `You scored ${right(s.answers)}/5 today`} : {done: false, text: n ? `${n} of 5 answered today` : "Five games are ready"}; }},
    {id: "counter", name: "Counter pick", href: "/counter/", desc: "Counter five enemies, one per lane.",
     status(){ const s = read("cp:daily:" + today()), n = count(s && s.picks), pts = Math.max(0, Math.floor(Number(s && s.score) || 0));
       return n >= 5 ? {done: true, text: `You scored ${pts}/500 today`} : {done: false, text: n ? `${n} of 5 rounds played today` : "Five enemies are waiting"}; }}
  ];
  const esc = s => String(s).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  // Cards for every game except the current one; unplayed games first.
  function moreHTML(currentId){
    const list = GAMES.filter(g => g.id !== currentId).map(g => ({g, s: g.status()})).sort((a, b) => a.s.done - b.s.done);
    return `<section class="moregames" aria-label="More daily games"><h3>More daily games</h3>${list.map(({g, s}) =>
      `<a class="xgame${s.done ? " played" : ""}" href="${g.href}"><span class="xg-t">${esc(g.name)}</span><span class="xg-d">${esc(g.desc)}</span>`
      + `<span class="xg-s${s.done ? " done" : ""}">${esc(s.text)}</span><span class="xg-go">${s.done ? "See results" : "Play"}</span></a>`).join("")}</section>`;
  }
  window.LaneLockGames = {GAMES, moreHTML, status: id => GAMES.find(g => g.id === id).status()};
})();
