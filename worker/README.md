# LoL Galaxy community stats

Cloudflare Worker that counts wins and losses for each day's LeagueSim daily draft.

- `GET /stats?date=YYYY-MM-DD` returns `{"date","wins","losses"}`
- `POST /result?date=YYYY-MM-DD` with `{"win": true|false}` records one result per player per day (from lolgalaxy.com only)

Deploys automatically: either Cloudflare's GitHub connection (root directory `worker`, deploy command `npx wrangler deploy`) or the "Deploy community stats counter" GitHub Action (needs `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` secrets).
