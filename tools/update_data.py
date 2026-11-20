#!/usr/bin/env python3
"""Update LaneLock's game data after a League patch.

  python3 tools/update_data.py --check
      Confirms the game, homepage and daily Discord post agree on tier data (same daily enemy team).

  python3 tools/update_data.py --sync-tiers
      Edit TIERS / ENEMY_WEIGHT in play/index.html first, then run this to copy them everywhere else.

  python3 tools/update_data.py --matchups rows.txt --source "Source name, patch 26.24, Emerald+"
      Rebuilds the lane matchup table in play/index.html from a rows file, then syncs tiers.

Rows file: one line per champion and lane, listing that champion's win rate against each opponent:
  top|Darius|Garen:54.97:4375,Teemo:49.37:1997,...
  (role is top, jungle, mid, adc or support; each item is Opponent:win-rate-percent:games)
Only use data you have permission to use, and update the source name shown to players.
"""
import argparse, json, re, statistics, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
GAME, HOME, WORKER = ROOT / "play" / "index.html", ROOT / "index.html", ROOT / "worker" / "src" / "daily.js"
B36 = "0123456789abcdefghijklmnopqrstuvwxyz"

def b36(n):
    n, s = int(n), ""
    while True:
        n, r = divmod(n, 36); s = B36[r] + s
        if n == 0: return s

def block(src, start):
    """Return (begin, end) of a `const NAME = {...};` block starting at the line `start`."""
    i = src.index(start)
    j = src.index("\n};\n", i) + 4
    return i, j

def build_matchups(rows_path, source):
    d = {}
    for line in Path(rows_path).read_text().splitlines():
        if not line.strip(): continue
        role, champ, rest = line.split("|", 2)
        if role not in ("top", "jungle", "mid", "adc", "support"): sys.exit(f"bad role in: {line[:60]}")
        for item in filter(None, (x.strip() for x in rest.split(","))):
            name, wr, games = item.rsplit(":", 2)
            d[(role, champ.strip(), name.strip())] = (float(wr), int(games))
    both = [(v[0] + d[(r, b, a)][0]) / 2 for (r, a, b), v in d.items() if (r, b, a) in d]
    base = statistics.mean(both) if both else 50.0
    out, seen = {}, set()
    for (r, a, b), _ in d.items():
        key = (r,) + tuple(sorted((a, b)))
        if a == b or key in seen: continue
        seen.add(key)
        x, y = key[1], key[2]
        ab, ba = d.get((r, x, y)), d.get((r, y, x))
        if ab and ba: edge, games = (ab[0] - ba[0]) / 2, max(ab[1], ba[1])
        elif ab: edge, games = ab[0] - base, ab[1]
        else: edge, games = -(ba[0] - base), ba[1]
        out.setdefault(r, []).append((x, y, edge, games))
    names = sorted({n for v in out.values() for e in v for n in e[:2]})
    idx = {n: i for i, n in enumerate(names)}
    packed = {r: " ".join(f"{b36(idx[x])}.{b36(idx[y])}.{int(round(float(f"{e:.2f}") * 100))}.{b36(g)}" for x, y, e, g in v) for r, v in out.items()}
    js = f"// Lane matchup win rates: {source}.\n"
    js += "// Each entry: champA.champB.edge.games  (indexes and games in base 36; edge = champA's win-rate lead in hundredths of a point)\n"
    js += f"const MATCHUP_SOURCE = {json.dumps(source)};\n"
    js += "const MATCHUP_NAMES = " + json.dumps(names) + ";\n"
    js += "const MATCHUP_DATA = {\n" + ",\n".join(f'  {r}: "{v}"' for r, v in packed.items()) + "\n};\n"
    print(f"{len(d)} win rates, {sum(len(v) for v in out.values())} matchups, {len(names)} champions, baseline {base:.2f}%")
    return js

def tier_blocks(src):
    t0, t1 = block(src, "const TIERS = {")
    w = re.search(r"const ENEMY_WEIGHT = \{.*?\};\n", src)
    return src[t0:t1], w.group(0)

def check():
    g, h, w = GAME.read_text(), HOME.read_text(), WORKER.read_text().replace("export const", "const")
    ok = tier_blocks(g) == tier_blocks(h) == tier_blocks(w)
    print("Game, homepage and daily Discord post all use the same tiers." if ok
          else "MISMATCH: run --sync-tiers so every page shows the same daily team as the game.")
    return ok

def sync_tiers():
    g, h, w = GAME.read_text(), HOME.read_text(), WORKER.read_text()
    (gt, gw), (ht, hw) = tier_blocks(g), tier_blocks(h)
    HOME.write_text(h.replace(ht, gt).replace(hw, gw))
    wt, ww = tier_blocks(w.replace("export const", "const"))
    WORKER.write_text(w.replace("export " + wt, "export " + gt).replace("export " + ww, "export " + gw))
    print("Copied tiers to the homepage and the Discord post.")

if __name__ == "__main__":
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--matchups"); ap.add_argument("--source")
    ap.add_argument("--sync-tiers", action="store_true"); ap.add_argument("--check", action="store_true")
    a = ap.parse_args()
    if a.matchups:
        if not a.source: sys.exit("--source is required with --matchups (it's shown to players)")
        g = GAME.read_text()
        i = g.index("// Lane matchup win rates:")
        j = g.index("\n};\n", g.index("const MATCHUP_DATA = {", i)) + 4
        GAME.write_text(g[:i] + build_matchups(a.matchups, a.source) + g[j:])
        sync_tiers()
        import subprocess  # the "Who wins the lane?" quiz is built from the same table
        subprocess.run([sys.executable, str(Path(__file__).with_name("build_matchups_game.py"))], check=True)
        # "Who wins the game?" and "Counter pick" use the Draft's model and the same table (needs Node)
        subprocess.run(["node", str(Path(__file__).with_name("build_new_games.mjs"))], check=True)
    elif a.sync_tiers:
        sync_tiers()
    sys.exit(0 if check() else 1)
