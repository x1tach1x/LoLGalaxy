# LaneLock data collector

Games counted so far, by game version: 16.21: 3,412, 16.22: 162,787, 16.23: 82,194.

## Version 16.23

- 82,194 games (euw1: 28,252, kr: 32,264, na1: 21,678)
- 19,849 lane matchups seen: 2,086 with 50+ games, 302 with 200+, 6 with 1,000+

## Version 16.22

- 162,787 games (euw1: 56,904, kr: 57,660, na1: 48,223)
- 24,340 lane matchups seen: 3,498 with 50+ games, 908 with 200+, 53 with 1,000+

## Version 16.21

- 3,412 games (euw1: 963, kr: 470, na1: 1,979)
- 5,971 lane matchups seen: 2 with 50+ games, 0 with 200+, 0 with 1,000+

## Compared with the game's current numbers (LoLalytics, patch 26.22, Emerald+)

Matchups with 100+ of our games that the game also has: 787.

- Correlation: 0.46 (1.00 would be identical)
- Average difference: 3.34 win-rate points
- Same favourite in 71% of matchups that aren't close to even

Biggest disagreements among matchups with 400+ of our games (smaller samples are mostly noise):

| Lane | Matchup | Ours | Current | Our games |
|---|---|---|---|---|
| adc | Yunara vs Zeri | 51.9% | 42.3% | 507 |
| support | Karma vs Thresh | 40.5% | 48.4% | 410 |
| adc | Ezreal vs Jinx | 53.7% | 46.1% | 499 |
| adc | Corki vs Xayah | 52.8% | 45.9% | 428 |
| support | Bard vs Nautilus | 54.9% | 49.1% | 519 |
| support | Alistar vs Thresh | 56.6% | 50.8% | 592 |
| adc | Ezreal vs Xayah | 50.9% | 45.2% | 800 |
| adc | Jhin vs Zeri | 52.8% | 47.3% | 623 |
| mid | Ahri vs Syndra | 56.5% | 51.2% | 414 |
| adc | Draven vs Ezreal | 58.6% | 53.4% | 447 |

## Best champions by role (16.23, regularly played picks only)

- **top:** Warwick 52.7% (1,206), Poppy 52.5% (893), Kayle 52.5% (1,605), Quinn 52.5% (875), Darius 52.4% (4,166)
- **jungle:** Zaahen 53.4% (1,006), Nidalee 53.3% (4,392), Udyr 53.0% (1,477), Elise 52.7% (3,222), Zac 52.7% (2,119)
- **mid:** Riven 54.2% (843), Pantheon 52.9% (1,026), Zoe 52.8% (2,735), Vel'Koz 52.6% (1,032), Ekko 51.9% (4,461)
- **adc:** Vel'Koz 55.0% (1,406), Hwei 54.7% (1,192), Aurelion Sol 54.0% (884), Yasuo 53.4% (1,681), Taliyah 52.8% (931)
- **support:** Zilean 52.7% (2,474), Elise 52.5% (1,385), Galio 52.4% (1,241), Rell 52.3% (5,776), Alistar 52.2% (9,434)

To use this data in the game: `python3 tools/update_data.py --matchups <state>/rows-16.23.txt --source "Riot API, patch 26.23, Emerald+"`
Only do this once LaneLock has an approved production API key.
