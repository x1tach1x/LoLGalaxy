# LaneLock data collector

Games counted so far, by game version: 16.21: 3,412, 16.22: 162,103, 16.23: 63,920.

## Version 16.23

- 63,920 games (euw1: 21,531, kr: 25,115, na1: 17,274)
- 18,348 lane matchups seen: 1,635 with 50+ games, 188 with 200+, 4 with 1,000+

## Version 16.22

- 162,103 games (euw1: 56,656, kr: 57,386, na1: 48,061)
- 24,321 lane matchups seen: 3,486 with 50+ games, 907 with 200+, 53 with 1,000+

## Version 16.21

- 3,412 games (euw1: 963, kr: 470, na1: 1,979)
- 5,971 lane matchups seen: 2 with 50+ games, 0 with 200+, 0 with 1,000+

## Compared with the game's current numbers (LoLalytics, patch 26.22, Emerald+)

Matchups with 100+ of our games that the game also has: 596.

- Correlation: 0.44 (1.00 would be identical)
- Average difference: 3.49 win-rate points
- Same favourite in 69% of matchups that aren't close to even

Biggest disagreements among matchups with 400+ of our games (smaller samples are mostly noise):

| Lane | Matchup | Ours | Current | Our games |
|---|---|---|---|---|
| adc | Ezreal vs Jinx | 55.0% | 46.1% | 400 |
| adc | Yunara vs Zeri | 50.8% | 42.3% | 400 |
| support | Alistar vs Thresh | 57.1% | 50.8% | 452 |
| jungle | Jarvan IV vs Lee Sin | 45.9% | 51.8% | 516 |
| support | Bard vs Nautilus | 54.8% | 49.1% | 418 |
| adc | Jhin vs Lucian | 56.7% | 51.2% | 543 |
| adc | Ezreal vs Xayah | 50.6% | 45.2% | 646 |
| adc | Jhin vs Zeri | 52.5% | 47.3% | 493 |
| adc | Corki vs Yunara | 48.9% | 52.8% | 452 |
| support | Leona vs Nautilus | 50.7% | 53.9% | 503 |

## Best champions by role (16.23, regularly played picks only)

- **top:** Poppy 54.2% (679), Quinn 53.2% (665), Cho'Gath 52.7% (1,619), Sylas 52.4% (787), Cassiopeia 52.3% (656)
- **jungle:** Zaahen 54.5% (778), Nidalee 53.6% (3,295), Ivern 52.9% (1,107), Sejuani 52.9% (905), Zac 52.7% (1,614)
- **mid:** Vel'Koz 54.1% (798), Pantheon 53.5% (796), Riven 53.2% (656), Zoe 53.1% (2,073), Qiyana 52.7% (1,427)
- **adc:** Hwei 56.1% (904), Vel'Koz 54.4% (1,086), Aurelion Sol 53.8% (703), Xerath 53.4% (657), Kog'Maw 53.2% (1,401)
- **support:** Morgana 52.9% (1,052), Janna 52.7% (3,352), Zilean 52.7% (1,931), Poppy 52.6% (1,582), Alistar 52.4% (7,255)

To use this data in the game: `python3 tools/update_data.py --matchups <state>/rows-16.23.txt --source "Riot API, patch 26.23, Emerald+"`
Only do this once LaneLock has an approved production API key.
