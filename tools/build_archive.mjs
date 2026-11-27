// Builds the daily answer archive: one page per finished day at /archive/YYYY-MM-DD/, an index at
// /archive/, and archive entries in sitemap.xml. A day's page is written once and never changed, so it
// keeps the answers players actually had even after the win-rate data is updated.
//   node tools/build_archive.mjs            build any missing days up to yesterday (UTC)
//   node tools/build_archive.mjs --rebuild  rewrite every day's page (only for layout fixes)
// Runs daily from .github/workflows/archive.yml.
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { loadEngine, ROOT } from "./engine.mjs";
import { dailyEnemy as dailyEnemyPairs, dailyNumber as draftNumber } from "../worker/src/daily.js";
// the worker returns [[lane label, champion], ...] in lane order (top, jungle, mid, bot, support)
const dailyEnemy = d => Object.fromEntries(dailyEnemyPairs(d).map(([, name], i) => [["top", "jungle", "mid", "adc", "support"][i], name]));

const FIRST_DAY = "2026-11-22";   // first day all four puzzles ran in their current format
const SITE = "https://lanelock.net";
const STATS_API = "https://lolgalaxy.dartanganj.workers.dev";
const REBUILD = process.argv.includes("--rebuild");

const read = rel => fs.readFileSync(path.join(ROOT, rel), "utf8");
const json = rel => JSON.parse(read(rel));
// the puzzles' own daily-set code (browser scripts), so the archive matches what players got
function loadBrowserScript(rel){ const ctx = {window: {}, Math, Date, Object, Array, Set, Map, JSON, Number, String}; vm.createContext(ctx); vm.runInContext(read(rel), ctx, {filename: rel}); return ctx.window; }
const WWL = loadBrowserScript("matchups/daily.js").WWL;
const TeamsDaily = loadBrowserScript("teams/daily.js").TeamsDaily;
const CounterDaily = loadBrowserScript("counter/daily.js").CounterDaily;
const MU = json("matchups/data.json"), TEAMS = json("teams/games.json"), CP = json("counter/data.json");
const E = loadEngine();

const esc = s => String(s).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const fmt = n => Number(n).toLocaleString("en-US");
const day = (d, k) => new Date(Date.parse(d + "T00:00:00Z") + k * 864e5).toISOString().slice(0, 10);
const longDate = d => new Date(d + "T12:00:00Z").toLocaleDateString("en-US", {weekday: "long", year: "numeric", month: "long", day: "numeric", timeZone: "UTC"});
const navDate = d => new Date(d + "T12:00:00Z").toLocaleDateString("en-US", {month: "short", day: "numeric", timeZone: "UTC"});
const midDate = d => new Date(d + "T12:00:00Z").toLocaleDateString("en-US", {month: "long", day: "numeric", year: "numeric", timeZone: "UTC"});
const shortDate = d => new Date(d + "T12:00:00Z").toLocaleDateString("en-US", {month: "short", day: "numeric", year: "numeric", timeZone: "UTC"});
const LANE = {top: "Top", jungle: "Jungle", mid: "Mid", adc: "Bot (ADC)", support: "Support"};
const ROLES = ["top", "jungle", "mid", "adc", "support"];
const BAND = ["Easy", "Medium", "Hard"];
const LANE_WORD = {top: "top", jungle: "jungle", mid: "mid", adc: "bot", support: "support"};
const sentence = t => /[.!?]$/.test(t) ? t : t + ".";
const quizNumber = d => WWL ? Math.max(1, Math.round((Date.parse(d + "T00:00:00Z") - Date.parse("2026-11-19T00:00:00Z")) / 864e5) + 1) : 0;

// champion portraits (Riot's image server); the version is looked up once, with a fallback
let DDV = "16.22.1";
const ddId = n => E.SPECIAL_IDS[n] || n.replace(/[^A-Za-z0-9]/g, "");
const portrait = n => `<img class="pt" src="https://ddragon.leagueoflegends.com/cdn/${DDV}/img/champion/${esc(ddId(n))}.png" alt="" width="28" height="28" loading="lazy">`;
const champ = n => `<span class="ch">${portrait(n)}<span>${esc(n)}</span></span>`;

async function getJSON(url){
  try { const r = await fetch(url, {signal: AbortSignal.timeout(8000)}); return r.ok ? await r.json() : null; } catch { return null; }
}

// ---------- one day's page ----------
async function dayPage(d, prev, next){
  // Draft: the enemy team and the strongest picks against each enemy (800+ ranked games)
  const enemy = dailyEnemy(d);
  const stats = await getJSON(`${STATS_API}/stats?date=${d}`);
  const played = stats ? (Number(stats.wins) || 0) + (Number(stats.losses) || 0) : 0;
  const draftRows = ROLES.map(role => {
    const e = enemy[role];
    const opts = E.POOL[role].filter(p => p !== e).map(p => [p, E.matchup(p, e, role)]).filter(([, m]) => m && m.g >= 800)
      .map(([p, m]) => [p, 50 + m.e, m.g]).sort((a, b) => b[1] - a[1]).slice(0, 3);
    const picks = opts.length ? opts.map(([p, wr, g]) => `${esc(p)} (${wr.toFixed(1)}%, ${fmt(g)} games)`).join(", ") : "Not enough ranked games against this champion to name counters.";
    return `<tr><td>${LANE[role]}</td><td class="c">${champ(e)}</td><td>${picks}</td></tr>`;
  }).join("");

  // Who wins the lane?
  const lane = WWL.dailyQuestions(MU, d).map(q => {
    const win = q.wrA > 50 ? q.a : q.b, lose = win === q.a ? q.b : q.a, wr = Math.max(q.wrA, 100 - q.wrA);
    return `<tr><td>${LANE[q.role]}</td><td class="c">${champ(win)}</td><td>beats ${esc(lose)}: ${wr.toFixed(1)}% in ${fmt(q.games)} games</td><td>${BAND[q.band]}</td></tr>`;
  }).join("");

  // Who wins the game?
  const games = TeamsDaily.daily(TEAMS, d).map((g, k) => {
    const winner = g.p > 50 ? "Blue" : "Red", pct = Math.max(g.p, 100 - g.p);
    return `<h3>Game ${k + 1} (${BAND[g.band].toLowerCase()}): ${winner} wins ${pct}% of the time</h3>
      <p class="teams"><span class="blue">Blue (${esc(g.styles[0])} comp):</span> ${g.blue.map(esc).join(", ")}<br>
      <span class="red">Red (${esc(g.styles[1])} comp):</span> ${g.red.map(esc).join(", ")}</p>
      <ul>${g.why.map(w => `<li>${esc(sentence(w))}</li>`).join("")}</ul>`;
  }).join("");

  // Counter pick
  const counters = CounterDaily.daily(CP, d).map(pz => {
    const top = pz.opts.slice(0, 5).map(o => `${esc(o.name)} ${o.wr.toFixed(1)}%`).join(", ");
    return `<tr><td>${LANE[pz.role]}</td><td class="c">${champ(pz.enemy)}</td><td><strong>${esc(pz.opts[0].name)}</strong> (${pz.opts[0].wr.toFixed(1)}% in ${fmt(pz.opts[0].games)} games). Top 5: ${top}</td></tr>`;
  }).join("");

  const title = `LaneLock answers for ${longDate(d)}`;
  const desc = `Answers and explanations for every LaneLock puzzle on ${shortDate(d)}: the Draft against ${ROLES.map(r => enemy[r]).join(", ")}, lane and 5v5 matchups, and the best counter picks.`;
  const nav = `<p class="daynav">${prev ? `<a href="/archive/${prev}/">← ${navDate(prev)}</a>` : "<span></span>"}<a href="/archive/">All days</a>${next ? `<a href="/archive/${next}/">${navDate(next)} →</a>` : "<span></span>"}</p>`;
  return page({title, desc, url: `/archive/${d}/`, body: `
    <h1>LaneLock answers: ${esc(midDate(d))}</h1>
    <p class="lede">Every LaneLock puzzle from ${longDate(d)}, with the answers and the reasons behind them. Today's puzzles are on the <a href="/">puzzles page</a>.</p>
    ${nav}

    <h2>Draft #${draftNumber(d)}</h2>
    <p>The enemy team was ${ROLES.map(r => `${esc(enemy[r])} (${LANE_WORD[r]})`).join(", ")}. These were the strongest picks against each enemy in ranked games, by win rate:</p>
    <table><thead><tr><th>Lane</th><th>Enemy</th><th>Best picks against them</th></tr></thead><tbody>${draftRows}</tbody></table>
    ${played ? `<p>${fmt(played)} ${played === 1 ? "player" : "players"} finished this draft and ${Math.round(100 * (Number(stats.wins) || 0) / played)}% won.</p>` : ""}
    <p class="muted">A draft is scored lane by lane, then on team composition. <a href="/how-it-works.html">How a draft is scored</a>.</p>

    <h2>Who wins the lane? #${quizNumber(d)}</h2>
    <p>The champion that won each matchup more often in ranked games:</p>
    <table><thead><tr><th>Lane</th><th>Winner</th><th>Result</th><th>Level</th></tr></thead><tbody>${lane}</tbody></table>

    <h2>Who wins the game? #${TeamsDaily.dailyNumber(d)}</h2>
    <p>Each game was simulated with LaneLock's match model, the same one that scores the Draft. The biggest reasons the favourite won:</p>
    ${games}

    <h2>Counter pick #${CounterDaily.dailyNumber(d)}</h2>
    <p>The best counter to each enemy, by win rate against them in that lane:</p>
    <table><thead><tr><th>Lane</th><th>Enemy</th><th>Best counter</th></tr></thead><tbody>${counters}</tbody></table>

    ${nav}
    <p class="muted">Win rates: ${esc(MU.source)} ranked solo queue.</p>`});
}

// ---------- the archive index ----------
function indexPage(days){
  const rows = days.slice().reverse().map(d => {
    const enemy = dailyEnemy(d);
    return `<li><a href="/archive/${d}/">${longDate(d)}</a><span class="muted"> Draft #${draftNumber(d)} against ${ROLES.map(r => esc(enemy[r])).join(", ")}</span></li>`;
  }).join("");
  return page({title: "LaneLock answer archive", desc: "Answers and explanations for every past LaneLock puzzle: the Draft, Who wins the lane?, Who wins the game? and Counter pick.", url: "/archive/", body: `
    <h1>Answer archive</h1>
    <p class="lede">Answers and explanations for every past LaneLock puzzle. A day's answers appear here once it's over (midnight UTC), so today's puzzles stay unspoiled.</p>
    <ul class="days">${rows}</ul>`});
}

function page({title, desc, url, body}){
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta http-equiv="Content-Security-Policy" content="object-src 'none'; base-uri 'self'; form-action 'none'; upgrade-insecure-requests">
<meta name="referrer" content="strict-origin-when-cross-origin">
<title>${esc(title)} – LaneLock</title>
<meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${SITE}${url}">
<meta property="og:type" content="article">
<meta property="og:site_name" content="LaneLock">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:url" content="${SITE}${url}">
<meta property="og:image" content="${SITE}/og.png">
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#0F1D2C">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="icon" href="/favicon-32.png" sizes="32x32" type="image/png">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="manifest" href="/manifest.webmanifest">
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7663278305650835" crossorigin="anonymous"></script>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Barlow:wght@400;500;600&family=Barlow+Condensed:wght@500;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/pages.css">
<link rel="stylesheet" href="/site.css">
<style>
.ch{display:inline-flex;align-items:center;gap:8px;color:var(--text);font-weight:600;line-height:1.2}
.pt{flex:none;width:28px;height:28px;border-radius:6px;background:var(--deck2)}
table{width:100%}
td{vertical-align:top}
.teams .blue{color:var(--blue);font-weight:600} .teams .red{color:#F07A6E;font-weight:600}
.daynav{display:flex;justify-content:space-between;gap:10px;margin:18px 0}
.days{list-style:none;padding:0}
.days li{padding:10px 0;border-bottom:1px solid var(--rule);margin:0}
.days a{font:600 20px var(--cond)}
.days .muted{display:block}
@media (max-width:560px){table{font-size:15px} th:nth-child(4),td:nth-child(4){display:none} h1{font-size:38px}}
</style>
</head>
<body>
<div class="wrap">
  <nav class="site-nav" aria-label="Site"><a class="home" href="/">Lane<span>Lock</span></a><span class="links"><a href="/">Puzzles</a><a href="/how-it-works.html">How it works</a><a href="/about.html">About</a></span></nav>
  <main>${body}
  </main>
  <footer class="site">
    <p class="links"><a href="/about.html">About</a><a href="/how-it-works.html">How it works</a><a href="/archive/">Answer archive</a><a href="/privacy.html">Privacy policy</a><a href="mailto:contact@lanelock.net">contact@lanelock.net</a></p>
    <p>LaneLock was created under Riot Games' "Legal Jibber Jabber" policy using assets owned by Riot Games. Riot Games does not endorse or sponsor this project. LaneLock isn't endorsed by Riot Games and doesn't reflect the views or opinions of Riot Games or anyone officially involved in producing or managing Riot Games properties. Riot Games and all associated properties are trademarks or registered trademarks of Riot Games, Inc.</p>
  </footer>
</div>
</body>
</html>
`;
}

// ---------- build ----------
const versions = await getJSON("https://ddragon.leagueoflegends.com/api/versions.json");
if (Array.isArray(versions) && versions[0]) DDV = versions[0];
const today = new Date().toISOString().slice(0, 10), days = [];
for (let d = FIRST_DAY; d < today; d = day(d, 1)) days.push(d);
let written = 0;
for (let k = 0; k < days.length; k++) {
  const d = days[k], file = path.join(ROOT, "archive", d, "index.html");
  // the newest day's "next" link appears when the following day is added, so rewrite only the previous newest page's nav
  const isNewest = k === days.length - 1, wasNewest = k === days.length - 2;
  if (fs.existsSync(file) && !REBUILD && !wasNewest) continue;
  if (fs.existsSync(file) && wasNewest && !REBUILD) {
    // keep the page as it was, only add the link to the next day
    const html = fs.readFileSync(file, "utf8"), next = days[k + 1];
    if (!html.includes(`/archive/${next}/`)) fs.writeFileSync(file, html.replaceAll(`<a href="/archive/">All days</a><span></span>`, `<a href="/archive/">All days</a><a href="/archive/${next}/">${navDate(next)} →</a>`));
    continue;
  }
  fs.mkdirSync(path.dirname(file), {recursive: true});
  fs.writeFileSync(file, await dayPage(d, days[k - 1], isNewest ? null : days[k + 1]));
  written++;
}
fs.mkdirSync(path.join(ROOT, "archive"), {recursive: true});
fs.writeFileSync(path.join(ROOT, "archive", "index.html"), indexPage(days));

// sitemap: keep the main pages, replace the archive entries
const smFile = path.join(ROOT, "sitemap.xml");
let sm = fs.readFileSync(smFile, "utf8").replace(/\s*<url><loc>https:\/\/lanelock\.net\/archive\/[^\n]*<\/url>/g, "");
const entries = [`  <url><loc>${SITE}/archive/</loc><changefreq>daily</changefreq><priority>0.6</priority></url>`]
  .concat(days.slice().reverse().map(d => `  <url><loc>${SITE}/archive/${d}/</loc><lastmod>${day(d, 1)}</lastmod><changefreq>never</changefreq><priority>0.5</priority></url>`));
sm = sm.replace("</urlset>", entries.join("\n") + "\n</urlset>");
fs.writeFileSync(smFile, sm);
console.log(`Archive: ${days.length} days (${FIRST_DAY} to ${days[days.length - 1] || "-"}), ${written} page(s) written, portraits from ${DDV}`);
