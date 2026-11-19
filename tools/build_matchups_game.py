#!/usr/bin/env python3
"""Build matchups/data.json for "Who wins the lane?" from LaneLock's own matchup data.

  python3 tools/build_matchups_game.py

It reads play/index.html (the same numbers LaneLock uses), so after updating the game's data with
tools/update_data.py, run this to refresh the quiz too. A matchup becomes a question when:
  - one side wins by at least 1 point, and
  - it has 500+ games (1,000+ when the gap is under 2 points, so the answer isn't luck).
Difficulty: easy = 4+ points apart, medium = 2-4, hard = 1-2.
"""
import json, re, datetime
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
GAME, OUT = ROOT / "play" / "index.html", ROOT / "matchups" / "data.json"


def main():
    src = GAME.read_text()
    source = re.search(r'const MATCHUP_SOURCE = "([^"]*)"', src).group(1)
    names = json.loads(re.search(r"const MATCHUP_NAMES = (\[.*?\]);", src).group(1))
    special = json.loads(re.search(r"const SPECIAL_IDS = (\{.*?\});", src, re.S).group(1))
    class_name = dict(re.findall(r'(\w+):"([^"]*)"', re.search(r"const CLASS_NAME = \{(.*?)\};", src, re.S).group(1)))
    raw = src[src.index("const RAW = `") + 13:]
    raw = raw[:raw.index("`")]
    cls = {line.split("|")[0]: line.split("|")[1] for line in raw.strip().splitlines()[1:] if "|" in line}

    block = src[src.index("const MATCHUP_DATA = {"):]
    block = block[:block.index("\n};")]
    questions, used = [], set()
    for role, packed in re.findall(r'  (\w+): "([^"]*)"', block):
        for entry in packed.split():
            a, b, edge, games = entry.split(".")
            a, b, edge, games = names[int(a, 36)], names[int(b, 36)], int(edge) / 100, int(games, 36)
            if a not in cls or b not in cls or abs(edge) < 1: continue
            if games < 500 or (abs(edge) < 2 and games < 1000): continue
            band = 0 if abs(edge) >= 4 else 1 if abs(edge) >= 2 else 2
            questions.append([role, a, b, round(50 + edge, 1), games, band])
            used.update((a, b))

    def dd_id(n):
        return special.get(n) or re.sub(r"[^A-Za-z0-9]", "", n)

    champs = {n: [dd_id(n), class_name.get(cls[n], "")] for n in sorted(used)}
    data = {"source": source, "built": datetime.date.today().isoformat(), "champs": champs, "q": questions}
    OUT.parent.mkdir(exist_ok=True)
    OUT.write_text(json.dumps(data, separators=(",", ":"), ensure_ascii=False))
    bands = [sum(q[5] == b for q in questions) for b in range(3)]
    print(f"{len(questions)} questions ({bands[0]} easy, {bands[1]} medium, {bands[2]} hard), "
          f"{len(champs)} champions, source: {source} -> {OUT.relative_to(ROOT)} ({OUT.stat().st_size // 1024} KB)")


if __name__ == "__main__":
    main()
