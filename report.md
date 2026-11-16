# LaneLock data collector

Games counted so far, by game version: 16.21: 472, 16.22: 6,797.

## Version 16.22

- 6,797 games (euw1: 2,243, kr: 2,335, na1: 2,219)
- 8,031 lane matchups seen: 38 with 50+ games, 0 with 200+, 0 with 1,000+

## Version 16.21

- 472 games (euw1: 154, kr: 132, na1: 186)
- 1,691 lane matchups seen: 0 with 50+ games, 0 with 200+, 0 with 1,000+

## Compared with the game's current numbers (LoLalytics, patch 26.22, Emerald+)

Matchups with 100+ of our games that the game also has: 5.

- Correlation: 0.24 (1.00 would be identical)
- Average difference: 1.79 win-rate points
- Same favourite in 100% of matchups that aren't close to even

Biggest disagreements:

| Lane | Matchup | Ours | Current | Our games |
|---|---|---|---|---|
| adc | Ezreal vs Kai'Sa | 48.9% | 45.4% | 131 |
| adc | Jhin vs Kai'Sa | 46.2% | 48.6% | 197 |
| adc | Kai'Sa vs Xayah | 47.0% | 45.4% | 117 |
| adc | Ezreal vs Jhin | 44.5% | 45.8% | 155 |
| adc | Kai'Sa vs Yunara | 49.1% | 49.2% | 108 |

## Best champions by role (16.22, 200+ games)

- **top:** Fiora 57.0% (386), Shen 56.6% (242), Singed 54.1% (246), Pantheon 54.1% (283), Aatrox 53.5% (288)
- **jungle:** Cho'Gath 57.4% (282), Elise 57.0% (242), Zyra 56.4% (257), Zac 55.6% (216), Lillia 54.2% (321)
- **mid:** Zed 55.3% (414), LeBlanc 55.0% (362), Yone 53.3% (533), Hwei 52.4% (246), Katarina 52.3% (365)
- **adc:** Zeri 53.2% (477), Kalista 53.1% (454), Xayah 53.0% (613), Draven 52.3% (323), Jinx 52.2% (515)
- **support:** Senna 53.8% (392), Leona 53.0% (585), Bard 52.9% (456), Janna 51.9% (368), Alistar 51.8% (753)

To use this data in the game: `python3 tools/update_data.py --matchups <state>/rows-16.22.txt --source "Riot API, patch 26.22, Emerald+"`
Only do this once LaneLock has an approved production API key.
