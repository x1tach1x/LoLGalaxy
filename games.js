/* LaneLock's daily puzzles, and today's progress in each one (read from this browser's saved results).
   Used by the results screens ("Still to play today") so every puzzle links to the others. */
(function(){
  const today = () => new Date().toISOString().slice(0, 10);
  const read = k => { try { return JSON.parse(localStorage.getItem(k)); } catch(e) { return null; } };
  const count = a => Array.isArray(a) ? a.length : 0;
  const right = a => Array.isArray(a) ? a.filter(Boolean).length : 0;
  // status(): {done, started, text}
  const GAMES = [
    {id: "draft", name: "Draft", href: "/play/", desc: "Counter today's five enemies.",
     status(){ const d = read("leaguesim:daily"); return d && d.date === today() && typeof d.win === "boolean"
       ? {done: true, text: d.win ? "You won today's draft" : "You lost today's draft"} : {done: false, text: "Today's draft is waiting"}; }},
    {id: "matchups", name: "Who wins the lane?", href: "/matchups/", desc: "Pick the winner of ten matchups.",
     status(){ const s = read("wwl:daily:" + today()), n = count(s && s.answers);
       return n >= 10 ? {done: true, text: `You scored ${right(s.answers)}/10 today`} : {done: false, started: n > 0, text: n ? `${n} of 10 answered today` : "Ten matchups are ready"}; }},
    {id: "teams", name: "Who wins the game?", href: "/teams/", desc: "Two full teams. Pick the one that wins.",
     status(){ const s = read("wwg:daily:" + today()), n = count(s && s.answers);
       return n >= 5 ? {done: true, text: `You scored ${right(s.answers)}/5 today`} : {done: false, started: n > 0, text: n ? `${n} of 5 answered today` : "Five games are ready"}; }},
    {id: "counter", name: "Counter pick", href: "/counter/", desc: "Counter five enemies, one per lane.",
     status(){ const s = read("cp:daily:" + today()), n = count(s && s.picks), pts = Math.max(0, Math.floor(Number(s && s.score) || 0));
       return n >= 5 ? {done: true, text: `You scored ${pts}/500 today`} : {done: false, started: n > 0, text: n ? `${n} of 5 rounds played today` : "Five enemies are waiting"}; }}
  ];
  const esc = s => String(s).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  // Cards for the games you haven't finished today (never the current one).
  // Once every game is done, a short note instead.
  function moreHTML(currentId){
    const left = GAMES.filter(g => g.id !== currentId).map(g => ({g, s: g.status()})).filter(x => !x.s.done);
    if (!left.length) return `<section class="moregames" aria-label="More daily puzzles"><h3>That's every puzzle for today</h3>`
      + `<p class="alldone">You've played all of LaneLock's daily puzzles. New ones start at midnight UTC.</p></section>`;
    return `<section class="moregames" aria-label="More daily puzzles"><h3>Still to play today</h3>${left.map(({g, s}) =>
      `<a class="xgame" href="${g.href}"><span class="xg-t">${ICON[g.id]}${esc(g.name)}</span><span class="xg-d">${esc(g.desc)}</span>`
      + `<span class="xg-s">${esc(s.text)}</span><span class="xg-go">${s.started ? "Keep going" : "Play"}</span></a>`).join("")}</section>`;
  }
  // Small icons matching the homepage buttons (each has a dark outline so it reads on gold too).
  const ICON = {
    draft: `<svg class="pz-ic" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="11" fill="#E7B53C" stroke="#0F1D2C" stroke-width="1.5"/><path d="M9 11V9.2a3 3 0 0 1 6 0V11" fill="none" stroke="#1a1405" stroke-width="1.8" stroke-linecap="round"/><rect x="7.6" y="10.6" width="8.8" height="6.6" rx="1.6" fill="#1a1405"/></svg>`,
    matchups: `<svg class="pz-ic" viewBox="0 0 30 24" aria-hidden="true"><circle cx="9.5" cy="12" r="8" fill="#1C3249" stroke="#4EA1DF" stroke-width="2.4"/><circle cx="20.5" cy="12" r="8" fill="#1C3249" stroke="#E35B4F" stroke-width="2.4"/></svg>`,
    teams: `<svg class="pz-ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 1a11 11 0 0 0 0 22z" fill="#4EA1DF"/><path d="M12 1a11 11 0 0 1 0 22z" fill="#E35B4F"/><circle cx="12" cy="12" r="11" fill="none" stroke="#0F1D2C" stroke-width="1.5"/></svg>`,
    counter: `<svg class="pz-ic" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="11" fill="#E7B53C" stroke="#0F1D2C" stroke-width="1.5"/><circle cx="12" cy="12" r="5" fill="none" stroke="#1a1405" stroke-width="2"/><path d="M12 4.5v4M12 15.5v4M4.5 12h4M15.5 12h4" stroke="#1a1405" stroke-width="2" stroke-linecap="round"/></svg>`
  };

  // A row of all four puzzles at the top of each puzzle page, so you can switch at any point.
  const SHORT = {draft: "Draft", matchups: "Who wins the lane?", teams: "Who wins the game?", counter: "Counter pick"};
  function switcherHTML(currentId){
    return GAMES.map(g => {
      const s = g.status(), cur = g.id === currentId;
      const mark = s.done ? `<span class="pz-done" aria-label="done today">✓</span>` : s.started ? `<span class="pz-dot" aria-label="in progress"></span>` : "";
      return `<a href="${g.href}"${cur ? ' aria-current="page"' : ""}>${ICON[g.id]}<span>${esc(SHORT[g.id])}</span>${mark}</a>`;
    }).join("");
  }
  function mountSwitcher(){
    document.querySelectorAll("[data-puzzles]").forEach(el => { el.innerHTML = switcherHTML(el.dataset.puzzles); });
  }
  mountSwitcher();
  // keep the ticks current when a puzzle is finished on this page or in another tab
  addEventListener("storage", mountSwitcher);
  window.LaneLockGames = {GAMES, ICON, moreHTML, switcherHTML, refreshSwitcher: mountSwitcher, status: id => GAMES.find(g => g.id === id).status()};
})();
