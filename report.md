# LaneLock data collector

Games counted so far, by game version: 16.21: 3,412, 16.22: 155,839, 16.23: 34,497.

## Version 16.23

- 34,497 games (euw1: 11,532, kr: 14,259, na1: 8,706)
- 14,883 lane matchups seen: 757 with 50+ games, 57 with 200+, 3 with 1,000+

## Version 16.22

- 155,839 games (euw1: 54,270, kr: 54,989, na1: 46,580)
- 24,092 lane matchups seen: 3,392 with 50+ games, 859 with 200+, 48 with 1,000+

## Version 16.21

- 3,412 games (euw1: 963, kr: 470, na1: 1,979)
- 5,971 lane matchups seen: 2 with 50+ games, 0 with 200+, 0 with 1,000+

## Compared with the game's current numbers (LoLalytics, patch 26.22, Emerald+)

Matchups with 100+ of our games that the game also has: 220.

- Correlation: 0.35 (1.00 would be identical)
- Average difference: 3.74 win-rate points
- Same favourite in 68% of matchups that aren't close to even

Biggest disagreements among matchups with 400+ of our games (smaller samples are mostly noise):

| Lane | Matchup | Ours | Current | Our games |
|---|---|---|---|---|
| adc | Corki vs Jhin | 44.9% | 51.0% | 401 |
| adc | Ezreal vs Yunara | 44.1% | 47.4% | 492 |
| adc | Ezreal vs Jhin | 48.2% | 45.8% | 1,187 |
| adc | Jhin vs Yunara | 52.7% | 50.7% | 427 |
| support | Alistar vs Nautilus | 52.2% | 54.0% | 404 |
| adc | Kai'Sa vs Xayah | 47.2% | 45.4% | 591 |
| adc | Jhin vs Kai'Sa | 46.9% | 48.6% | 1,036 |
| adc | Corki vs Ezreal | 51.8% | 52.5% | 411 |
| adc | Ezreal vs Kai'Sa | 45.0% | 45.4% | 1,356 |

## Best champions by role (16.23, regularly played picks only)

- **top:** Kayle 54.5% (600), Poppy 54.4% (375), Cassiopeia 54.2% (369), Anivia 53.6% (427), Cho'Gath 53.1% (845)
- **jungle:** Zaahen 55.4% (381), Udyr 55.2% (582), Ivern 54.7% (614), Skarner 54.5% (617), Zac 54.0% (834)
- **mid:** Pantheon 56.5% (446), Qiyana 54.3% (796), Katarina 53.0% (1,819), Vladimir 52.7% (1,097), Hwei 52.2% (1,248)
- **adc:** Hwei 55.3% (479), Vel'Koz 55.3% (537), Vayne 54.2% (557), Kog'Maw 53.7% (756), Draven 52.4% (1,564)
- **support:** Morgana 55.0% (551), Poppy 53.9% (894), Galio 53.8% (465), Janna 53.7% (1,747), Zilean 52.9% (987)

To use this data in the game: `python3 tools/update_data.py --matchups <state>/rows-16.23.txt --source "Riot API, patch 26.23, Emerald+"`
Only do this once LaneLock has an approved production API key.
