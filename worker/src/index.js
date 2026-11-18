// LaneLock community stats: counts wins and losses for each day's LaneLock daily draft.
//
//   GET  /stats?date=YYYY-MM-DD   -> {"date","wins","losses","hist"}
//   POST /result?date=YYYY-MM-DD  body {"win": true|false, "p": 0-100} -> updated totals
//
// "hist" counts how many drafts finished with each whole-percent win chance (index 0-100),
// so the game can tell a player what share of today's drafts theirs beat.
//
// Each day has its own Durable Object, so counting is atomic. A player is counted once
// per day by a SHA-256 hash of their IP address and a random secret that's generated for
// that day and never leaves Cloudflare. Raw IPs are never stored, and because the code is
// public the secret is what stops anyone from reversing the hashes.
// Results are only accepted from the LaneLock site, and only for today or yesterday (UTC).

import { dailyEnemy, dailyNumber } from "./daily.js";

const ALLOWED_ORIGINS = [
  "https://lanelock.net",
  "https://www.lanelock.net",
  "https://lolgalaxy.com",
  "https://www.lolgalaxy.com",
  "https://x1tach1x.github.io",
];

export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin") || "";
    const cors = {
      "Access-Control-Allow-Origin": ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0],
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Max-Age": "86400",
      "Vary": "Origin",
      "X-Content-Type-Options": "nosniff",
    };
    const reply = (body, status = 200, extra = {}) =>
      new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json", ...cors, ...extra } });

    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });

    const url = new URL(request.url);
    const date = url.searchParams.get("date") || "";
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return reply({ error: "date must be YYYY-MM-DD" }, 400);

    const day = env.DAILY.get(env.DAILY.idFromName(date));

    if (url.pathname === "/stats" && request.method === "GET") {
      const totals = await (await day.fetch("https://do/totals")).json();
      return reply({ date, ...totals }, 200, { "Cache-Control": "public, max-age=30" });
    }

    if (url.pathname === "/result" && request.method === "POST") {
      if (!ALLOWED_ORIGINS.includes(origin)) return reply({ error: "origin not allowed" }, 403);
      const today = new Date().toISOString().slice(0, 10);
      const yesterday = new Date(Date.now() - 864e5).toISOString().slice(0, 10);
      if (date !== today && date !== yesterday) return reply({ error: "only today's daily can be submitted" }, 400);

      if (Number(request.headers.get("Content-Length") || 0) > 200) return reply({ error: "body too large" }, 413);
      let body;
      try { body = JSON.parse((await request.text()).slice(0, 200)); } catch { return reply({ error: "invalid JSON" }, 400); }
      if (typeof body?.win !== "boolean") return reply({ error: "win must be true or false" }, 400);
      const p = Number.isInteger(body.p) && body.p >= 0 && body.p <= 100 ? body.p : null;

      const ip = request.headers.get("CF-Connecting-IP") || "unknown";
      const res = await day.fetch("https://do/vote", { method: "POST", body: JSON.stringify({ ip, win: body.win, p }) });
      return reply({ date, ...(await res.json()) });
    }

    return reply({ error: "not found" }, 404);
  },

  // Runs on the cron schedule in wrangler.toml (just after midnight UTC). If a Discord
  // webhook is saved as the DISCORD_WEBHOOK secret, posts the new daily's enemy team.
  async scheduled(event, env, ctx) {
    ctx.waitUntil(postDaily(env));
  },
};

export async function postDaily(env, now = new Date()) {
  const hook = env.DISCORD_WEBHOOK || "";
  if (!/^https:\/\/(discord\.com|discordapp\.com)\/api\/webhooks\//.test(hook)) return "skipped: no Discord webhook set";
  const today = now.toISOString().slice(0, 10);
  const yesterday = new Date(now.getTime() - 864e5).toISOString().slice(0, 10);
  const lines = dailyEnemy(today).map(([lane, champ]) => `**${lane}:** ${champ}`);
  let recap = "";
  try {
    const t = await (await env.DAILY.get(env.DAILY.idFromName(yesterday)).fetch("https://do/totals")).json();
    const total = t.wins + t.losses;
    if (total) recap = `\nYesterday ${total.toLocaleString("en-US")} player${total === 1 ? "" : "s"} drafted, and ${Math.round(t.wins / total * 100)}% won.`;
  } catch {}
  const content = `**LaneLock Daily #${dailyNumber(today)} is live.** Today's enemy team:\n${lines.join("\n")}\n\nCan you draft the counter? https://lanelock.net/play/${recap}`;
  const res = await fetch(hook, { method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content, username: "LaneLock", allowed_mentions: { parse: [] } }) });
  return res.ok ? "posted" : `Discord answered ${res.status}`;
}

export class DailyStats {
  constructor(state) {
    this.storage = state.storage;
  }

  async totals() {
    const t = (await this.storage.get("totals")) || { wins: 0, losses: 0 };
    const hist = (await this.storage.get("hist")) || new Array(101).fill(0);
    return { wins: t.wins, losses: t.losses, hist };
  }

  async fetch(request) {
    const path = new URL(request.url).pathname;
    if (path === "/vote" && request.method === "POST") {
      const { ip, win, p } = await request.json();
      let salt = await this.storage.get("salt");
      if (!salt) {
        salt = [...crypto.getRandomValues(new Uint8Array(32))].map(b => b.toString(16).padStart(2, "0")).join("");
        await this.storage.put("salt", salt);
      }
      const key = "v:" + (await sha256(`${salt}|${ip}`));
      const all = await this.totals();
      if (!(await this.storage.get(key))) {
        win ? all.wins++ : all.losses++;
        if (Number.isInteger(p) && p >= 0 && p <= 100) all.hist[p]++;
        await this.storage.put({ [key]: 1, totals: { wins: all.wins, losses: all.losses }, hist: all.hist });
      }
      return Response.json(all);
    }
    return Response.json(await this.totals());
  }
}

async function sha256(text) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, "0")).join("");
}
