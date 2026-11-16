#!/usr/bin/env python3
"""LaneLock match collector: builds lane matchup win rates from the official Riot API.

It samples Emerald+ ranked solo queue games and keeps only champion totals:
  - lane matchups: how often each champion beat the champion opposite them in the same role
  - champion win rates per role (for future tier lists)
Player identities are never stored or printed. Match IDs are kept only as short one-way
hashes so the same game isn't counted twice.

Usage (normally run by .github/workflows/collect.yml):
  RIOT_API_KEY=... python3 collector/collect.py --state data --minutes 60

Writes into the state folder:
  patches/<patch>.json   running totals for each game patch
  seen.txt               hashed match IDs already counted
  rows-<patch>.txt       matchup rows for tools/update_data.py
  report.md              what was collected and how it compares to the game's current data
Standard library only, so it runs anywhere Python 3.9+ is installed.
"""
import argparse, hashlib, json, math, os, random, re, sys, time, urllib.error, urllib.parse, urllib.request
from collections import deque
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
GAME = ROOT / "play" / "index.html"

REGIONS = {"na1": "americas", "euw1": "europe", "kr": "asia"}   # platform -> regional routing
QUEUE, QUEUE_ID = "RANKED_SOLO_5x5", 420
APEX = ["challengerleagues", "grandmasterleagues", "masterleagues"]
DIVISIONS = [(t, d) for t in ("DIAMOND", "EMERALD") for d in ("I", "II", "III", "IV")]
ROLE = {"TOP": "top", "JUNGLE": "jungle", "MIDDLE": "mid", "BOTTOM": "adc", "UTILITY": "support"}
LOOKBACK_DAYS = 14          # only sample games from the last two weeks
MIN_GAMES = 10              # matchups with fewer games are left out of the rows file
MAX_SEEN = 400_000          # hashed match IDs to remember


class KeyProblem(Exception):
    """The API key is missing, expired or not allowed."""


def log(msg):
    print(time.strftime("%H:%M:%S"), msg, flush=True)


class Riot:
    """Tiny Riot API client that stays under the app rate limits for each routing host."""

    def __init__(self, key, base, safety=0.9):
        self.key, self.base, self.safety = key, base, safety
        self.limits = {}     # host -> [(count, seconds, deque_of_times)]
        self.calls = 0

    def _windows(self, host):
        # Development keys start at 20 per second and 100 per 2 minutes; real limits come from response headers.
        return self.limits.setdefault(host, [(20, 1, deque()), (100, 120, deque())])

    def _wait(self, host):
        while True:
            now, pause = time.monotonic(), 0.0
            for n, sec, q in self._windows(host):
                while q and q[0] <= now - sec: q.popleft()
                cap = max(1, math.floor(n * self.safety))
                if len(q) >= cap: pause = max(pause, q[0] + sec - now + 0.05)
            if pause <= 0: return
            time.sleep(min(pause, 30))

    def _record(self, host, headers):
        now = time.monotonic()
        spec = headers.get("X-App-Rate-Limit") if headers else None
        if spec:
            try:
                want = [tuple(int(x) for x in part.split(":")) for part in spec.split(",")]
                cur = self._windows(host)
                if [(n, s) for n, s, _ in cur] != want:
                    self.limits[host] = [(n, s, deque()) for n, s in want]
            except ValueError:
                pass
        for _, _, q in self._windows(host): q.append(now)
        self.calls += 1

    def get(self, host, path, params=None):
        url = self.base.format(host=host) + path + ("?" + urllib.parse.urlencode(params) if params else "")
        for attempt in range(6):
            self._wait(host)
            req = urllib.request.Request(url, headers={"X-Riot-Token": self.key, "User-Agent": "LaneLock collector (+https://lanelock.net)"})
            try:
                with urllib.request.urlopen(req, timeout=25) as r:
                    self._record(host, r.headers)
                    return json.loads(r.read().decode())
            except urllib.error.HTTPError as e:
                self._record(host, e.headers)
                if e.code in (401, 403): raise KeyProblem(f"Riot API answered {e.code}")
                if e.code == 404: return None
                if e.code == 429:
                    time.sleep(int(e.headers.get("Retry-After") or 10)); continue
                if e.code >= 500:
                    time.sleep(2 ** attempt); continue
                return None
            except (urllib.error.URLError, TimeoutError, ConnectionError):
                time.sleep(2 ** attempt)
        return None


def champion_names(ddragon_base):
    """Data Dragon id (as used in match data, e.g. MonkeyKing) -> display name (Wukong)."""
    with urllib.request.urlopen(ddragon_base + "/api/versions.json", timeout=25) as r:
        version = json.loads(r.read().decode())[0]
    with urllib.request.urlopen(f"{ddragon_base}/cdn/{version}/data/en_US/champion.json", timeout=25) as r:
        data = json.loads(r.read().decode())["data"]
    return {cid: c["name"] for cid, c in data.items()}


def game_champions():
    """Champion names LaneLock knows about (the RAW table in play/index.html)."""
    src = GAME.read_text()
    raw = src[src.index("const RAW = `"):]
    raw = raw[:raw.index("`", 13)]
    return {line.split("|")[0] for line in raw.splitlines()[1:] if "|" in line}


def short_hash(match_id):
    return hashlib.sha256(match_id.encode()).hexdigest()[:16]


class State:
    def __init__(self, folder):
        self.dir = Path(folder); (self.dir / "patches").mkdir(parents=True, exist_ok=True)
        seen = self.dir / "seen.txt"
        self.seen_list = seen.read_text().split() if seen.exists() else []
        self.seen = set(self.seen_list)
        self.patches = {}
        for f in (self.dir / "patches").glob("*.json"):
            self.patches[f.stem] = json.loads(f.read_text())

    def patch(self, p):
        return self.patches.setdefault(p, {"games": 0, "regions": {}, "pairs": {}, "champs": {}})

    def save(self):
        for p, d in self.patches.items():
            (self.dir / "patches" / f"{p}.json").write_text(json.dumps(d, separators=(",", ":"), sort_keys=True))
        keep = self.seen_list[-MAX_SEEN:]
        (self.dir / "seen.txt").write_text("\n".join(keep) + "\n")


def add_match(state, m, names, region):
    """Count one match. Returns the patch it was counted under, or None if skipped."""
    info = (m or {}).get("info") or {}
    if info.get("queueId") != QUEUE_ID: return None
    if (info.get("gameDuration") or 0) < 300: return None                   # remakes
    parts = info.get("participants") or []
    if len(parts) != 10 or any(p.get("gameEndedInEarlySurrender") for p in parts): return None
    teams = {100: {}, 200: {}}
    for p in parts:
        role, team = ROLE.get(p.get("teamPosition")), teams.get(p.get("teamId"))
        name = names.get(p.get("championName"))
        if role is None or team is None or name is None or role in team: return None
        team[role] = (name, bool(p.get("win")))
    if len(teams[100]) != 5 or len(teams[200]) != 5: return None
    version = str(info.get("gameVersion", ""))
    if not re.match(r"^\d+\.\d+", version): return None
    patch = ".".join(version.split(".")[:2])
    d = state.patch(patch)
    d["games"] += 1
    d["regions"][region] = d["regions"].get(region, 0) + 1
    for role in ROLE.values():
        (a, a_won), (b, _) = teams[100][role], teams[200][role]
        for name, won in ((a, a_won), (b, not a_won)):
            c = d["champs"].setdefault(f"{role}|{name}", [0, 0]); c[0] += 1; c[1] += int(won)
        if a == b: continue
        x, y = sorted((a, b))
        x_won = a_won if x == a else not a_won
        pr = d["pairs"].setdefault(f"{role}|{x}|{y}", [0, 0]); pr[0] += 1; pr[1] += int(x_won)
    return patch


def seed_players(riot, platform, limit):
    """A shuffled sample of Emerald+ ranked players (PUUIDs), kept in memory only."""
    puuids = []
    for league in APEX:
        d = riot.get(platform, f"/lol/league/v4/{league}/by-queue/{QUEUE}") or {}
        puuids += [e.get("puuid") for e in d.get("entries", [])]
    for tier, div in DIVISIONS:
        page = random.randint(1, 3)
        for e in riot.get(platform, f"/lol/league/v4/entries/{QUEUE}/{tier}/{div}", {"page": page}) or []:
            if e.get("puuid"): puuids.append(e["puuid"])
            elif e.get("summonerId") and len(puuids) < limit * 2:   # older responses without PUUIDs
                s = riot.get(platform, f"/lol/summoner/v4/summoners/{e['summonerId']}") or {}
                if s.get("puuid"): puuids.append(s["puuid"])
    puuids = list({p for p in puuids if p})
    random.shuffle(puuids)
    return puuids[:limit]


def collect(riot, state, names, regions, minutes, players_per_region):
    deadline = time.monotonic() + minutes * 60
    since = int(time.time()) - LOOKBACK_DAYS * 86400
    work = {}
    for platform in regions:
        if time.monotonic() > deadline: break
        players = seed_players(riot, platform, players_per_region)
        log(f"{platform}: sampled {len(players)} ranked players")
        work[platform] = {"players": deque(players), "matches": deque()}
    counted = skipped = 0
    last_save = time.monotonic()
    while time.monotonic() < deadline and any(w["players"] or w["matches"] for w in work.values()):
        for platform, w in work.items():
            if time.monotonic() >= deadline: break
            routing = REGIONS[platform]
            if w["matches"]:
                mid = w["matches"].popleft()
                h = short_hash(mid)
                if h in state.seen: continue
                m = riot.get(routing, f"/lol/match/v5/matches/{mid}")
                state.seen.add(h); state.seen_list.append(h)
                if add_match(state, m, names, platform): counted += 1
                else: skipped += 1
            elif w["players"]:
                puuid = w["players"].popleft()
                ids = riot.get(routing, f"/lol/match/v5/matches/by-puuid/{puuid}/ids",
                               {"queue": QUEUE_ID, "type": "ranked", "start": 0, "count": 20, "startTime": since}) or []
                w["matches"].extend(i for i in ids if short_hash(i) not in state.seen)
        if time.monotonic() - last_save > 300:
            state.save(); last_save = time.monotonic()
            log(f"progress: {counted} games counted, {skipped} skipped, {riot.calls} API calls")
    state.save()
    log(f"done: {counted} new games counted, {skipped} skipped (remakes or incomplete), {riot.calls} API calls")
    return counted


def decode_current():
    """The game's current matchup edges: {(role, a, b): (edge_for_a, games)} with a < b."""
    src = GAME.read_text()
    names = json.loads(re.search(r"const MATCHUP_NAMES = (\[.*?\]);", src).group(1))
    block = src[src.index("const MATCHUP_DATA = {"):]
    block = block[:block.index("\n};")]
    out = {}
    for role, packed in re.findall(r'  (\w+): "([^"]*)"', block):
        for e in packed.split():
            a, b, edge, g = e.split(".")
            a, b, edge, g = names[int(a, 36)], names[int(b, 36)], int(edge) / 100, int(g, 36)
            if a > b: a, b, edge = b, a, -edge
            out[(role, a, b)] = (edge, g)
    return out


def write_outputs(state, known):
    m = re.search(r'const MATCHUP_SOURCE = "([^"]*)"', GAME.read_text())
    source_note = m.group(1) if m else "current data"
    if not state.patches:
        (state.dir / "report.md").write_text("# LaneLock data collector\n\nNo games collected yet.\n"); return
    order = sorted(state.patches, key=lambda p: [int(x) for x in p.split(".")])
    latest = order[-1]
    lines = [f"# LaneLock data collector", "",
             f"Games counted so far, by game version: " + ", ".join(f"{p}: {state.patches[p]['games']:,}" for p in order) + ".", ""]
    for p in order[::-1][:2]:
        d = state.patches[p]
        rows = {}
        for key, (g, w) in d["pairs"].items():
            role, x, y = key.split("|")
            if g < MIN_GAMES or x not in known or y not in known: continue
            rows.setdefault((role, x), []).append(f"{y}:{100 * w / g:.2f}:{g}")
            rows.setdefault((role, y), []).append(f"{x}:{100 * (g - w) / g:.2f}:{g}")
        (state.dir / f"rows-{p}.txt").write_text("".join(f"{r}|{c}|{','.join(v)}\n" for (r, c), v in sorted(rows.items())))
        sizes = [g for g, _ in d["pairs"].values()]
        lines += [f"## Version {p}", "",
                  f"- {d['games']:,} games" + (f" ({', '.join(f'{k}: {v:,}' for k, v in sorted(d['regions'].items()))})" if d["regions"] else ""),
                  f"- {len(sizes):,} lane matchups seen: {sum(g >= 50 for g in sizes):,} with 50+ games, "
                  f"{sum(g >= 200 for g in sizes):,} with 200+, {sum(g >= 1000 for g in sizes):,} with 1,000+", ""]
    # how our numbers compare with the game's current data
    d, cur = state.patches[latest], decode_current()
    both = []
    for key, (g, w) in d["pairs"].items():
        role, x, y = key.split("|")
        if g >= 100 and (role, x, y) in cur:
            both.append((role, x, y, 100 * w / g - 50, cur[(role, x, y)][0], g))
    lines += [f"## Compared with the game's current numbers ({source_note})", ""]
    if len(both) >= 5:
        ours, theirs = [b[3] for b in both], [b[4] for b in both]
        mo, mt = sum(ours) / len(ours), sum(theirs) / len(theirs)
        cov = sum((o - mo) * (t - mt) for o, t in zip(ours, theirs))
        sd = math.sqrt(sum((o - mo) ** 2 for o in ours) * sum((t - mt) ** 2 for t in theirs)) or 1
        agree = sum((o > 0) == (t > 0) for o, t in zip(ours, theirs) if abs(t) >= 1) / max(1, sum(abs(t) >= 1 for t in theirs))
        lines += [f"Matchups with 100+ of our games that the game also has: {len(both):,}.", "",
                  f"- Correlation: {cov / sd:.2f} (1.00 would be identical)",
                  f"- Average difference: {sum(abs(o - t) for o, t in zip(ours, theirs)) / len(both):.2f} win-rate points",
                  f"- Same favourite in {100 * agree:.0f}% of matchups that aren't close to even", "",
                  "Biggest disagreements:", "", "| Lane | Matchup | Ours | Current | Our games |", "|---|---|---|---|---|"]
        for role, x, y, o, t, g in sorted(both, key=lambda b: -abs(b[3] - b[4]))[:10]:
            lines.append(f"| {role} | {x} vs {y} | {50 + o:.1f}% | {50 + t:.1f}% | {g:,} |")
    else:
        lines.append("Not enough overlapping matchups with 100+ games yet. Run the collector for longer.")
    lines += ["", f"## Best champions by role ({latest}, 200+ games)", ""]
    if not any(g >= 200 for g, _ in d["champs"].values()):
        lines.append("No champion has 200+ games in one role yet.")
    for role in ROLE.values():
        best = sorted(((w / g, g, k.split("|")[1]) for k, (g, w) in d["champs"].items()
                       if k.startswith(role + "|") and g >= 200), reverse=True)[:5]
        if best:
            lines.append(f"- **{role}:** " + ", ".join(f"{n} {100 * r:.1f}% ({g:,})" for r, g, n in best))
    major, minor = latest.split(".")
    label = f"{int(major) + 10}.{minor}"   # game version 16.22 is what players call patch 26.22
    lines += ["", f"To use this data in the game: `python3 tools/update_data.py --matchups <state>/rows-{latest}.txt "
              f"--source \"Riot API, patch {label}, Emerald+\"`",
              "Only do this once LaneLock has an approved production API key."]
    (state.dir / "report.md").write_text("\n".join(lines) + "\n")


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--state", default="data", help="folder that keeps totals between runs")
    ap.add_argument("--minutes", type=float, default=60, help="stop collecting after this long")
    ap.add_argument("--regions", default=",".join(REGIONS), help="comma-separated: " + ", ".join(REGIONS))
    ap.add_argument("--players", type=int, default=400, help="players to sample per region")
    ap.add_argument("--report-only", action="store_true", help="just rebuild rows files and the report")
    a = ap.parse_args()
    state, known = State(a.state), game_champions()
    if not a.report_only:
        key = os.environ.get("RIOT_API_KEY", "").strip()
        if not key:
            print("::warning::No RIOT_API_KEY secret is set, so nothing was collected. "
                  "Add it under Settings > Secrets and variables > Actions.")
            write_outputs(state, known)
            return 0
        regions = [r.strip() for r in a.regions.split(",") if r.strip() in REGIONS]
        riot = Riot(key, os.environ.get("RIOT_API_BASE", "https://{host}.api.riotgames.com"))
        try:
            names = champion_names(os.environ.get("DDRAGON_BASE", "https://ddragon.leagueoflegends.com"))
            collect(riot, state, names, regions, a.minutes, a.players)
        except KeyProblem as e:
            # Expected every day with a development key, so this isn't treated as a failure:
            # scheduled runs just skip until a fresh key is saved.
            state.save(); write_outputs(state, known)
            print(f"::warning::{e}: the API key has expired or isn't allowed. Development keys last 24 hours; "
                  "generate a new one in the Riot Developer Portal and update the RIOT_API_KEY secret. "
                  "Totals collected so far were saved, and the next scheduled run will pick up the new key.")
            with open(os.environ.get("GITHUB_STEP_SUMMARY", os.devnull), "a") as f:
                f.write("> **Riot API key expired.** Paste a fresh development key into the RIOT_API_KEY secret "
                        "and the next scheduled run will continue.\n\n")
            return 0
    write_outputs(state, known)
    return 0


if __name__ == "__main__":
    sys.exit(main())
