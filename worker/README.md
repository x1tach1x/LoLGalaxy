# LaneLock community stats

Cloudflare Worker that counts wins and losses for each day's LaneLock daily draft.

- `GET /stats?date=YYYY-MM-DD` returns `{"date","wins","losses"}`
- `POST /result?date=YYYY-MM-DD` with `{"win": true|false}` records one result per player per day (from lanelock.net or lolgalaxy.com only)

Deploys automatically through Cloudflare's GitHub connection (root directory `worker`, deploy command `npx wrangler deploy`).
