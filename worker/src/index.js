// LoL Galaxy community stats: counts wins and losses for each day's LeagueSim daily draft.
//
//   GET  /stats?date=YYYY-MM-DD   -> {"date","wins","losses"}
//   POST /result?date=YYYY-MM-DD  body {"win": true|false} -> updated totals
//
// Each day has its own Durable Object, so counting is atomic. A player (IP address,
// hashed with the date so raw IPs are never stored) is counted once per day.
// Results are only accepted from the LoL Galaxy site, and only for today or yesterday (UTC).

const ALLOWED_ORIGINS = [
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

      let body;
      try { body = await request.json(); } catch { return reply({ error: "invalid JSON" }, 400); }
      if (typeof body?.win !== "boolean") return reply({ error: "win must be true or false" }, 400);

      const ip = request.headers.get("CF-Connecting-IP") || "unknown";
      const voter = await sha256(`${ip}|${date}|${env.SALT || "lolgalaxy"}`);
      const res = await day.fetch("https://do/vote", { method: "POST", body: JSON.stringify({ voter, win: body.win }) });
      return reply({ date, ...(await res.json()) });
    }

    return reply({ error: "not found" }, 404);
  },
};

export class DailyStats {
  constructor(state) {
    this.storage = state.storage;
  }

  async totals() {
    return (await this.storage.get("totals")) || { wins: 0, losses: 0 };
  }

  async fetch(request) {
    const path = new URL(request.url).pathname;
    if (path === "/vote" && request.method === "POST") {
      const { voter, win } = await request.json();
      const key = "v:" + voter;
      const totals = await this.totals();
      if (!(await this.storage.get(key))) {
        win ? totals.wins++ : totals.losses++;
        await this.storage.put({ [key]: 1, totals });
      }
      return Response.json(totals);
    }
    return Response.json(await this.totals());
  }
}

async function sha256(text) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, "0")).join("");
}
