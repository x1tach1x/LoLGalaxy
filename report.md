# LaneLock data collector

Games counted so far, by game version: 16.21: 3,412, 16.22: 157,812, 16.23: 40,827.

## Version 16.23

- 40,827 games (euw1: 14,266, kr: 16,003, na1: 10,558)
- 15,866 lane matchups seen: 938 with 50+ games, 80 with 200+, 3 with 1,000+

## Version 16.22

- 157,812 games (euw1: 55,049, kr: 55,727, na1: 47,036)
- 24,154 lane matchups seen: 3,425 with 50+ games, 871 with 200+, 51 with 1,000+

## Version 16.21

- 3,412 games (euw1: 963, kr: 470, na1: 1,979)
- 5,971 lane matchups seen: 2 with 50+ games, 0 with 200+, 0 with 1,000+

## Compared with the game's current numbers (LoLalytics, patch 26.22, Emerald+)

Matchups with 100+ of our games that the game also has: 289.

- Correlation: 0.44 (1.00 would be identical)
- Average difference: 3.56 win-rate points
- Same favourite in 68% of matchups that aren't close to even

Biggest disagreements among matchups with 400+ of our games (smaller samples are mostly noise):

| Lane | Matchup | Ours | Current | Our games |
|---|---|---|---|---|
| adc | Corki vs Jhin | 46.2% | 51.0% | 463 |
| adc | Ezreal vs Jhin | 49.1% | 45.8% | 1,385 |
| adc | Kai'Sa vs Yunara | 46.7% | 49.2% | 473 |
| adc | Jhin vs Kai'Sa | 46.7% | 48.6% | 1,198 |
| support | Lulu vs Nautilus | 52.7% | 51.0% | 438 |
| adc | Jhin vs Yunara | 52.4% | 50.7% | 521 |
| adc | Ezreal vs Yunara | 45.9% | 47.4% | 595 |
| adc | Kai'Sa vs Xayah | 46.6% | 45.4% | 689 |
| adc | Corki vs Ezreal | 51.4% | 52.5% | 463 |
| adc | Corki vs Kai'Sa | 53.1% | 52.1% | 426 |

## Best champions by role (16.23, regularly played picks only)

- **top:** Cassiopeia 55.4% (426), Poppy 54.9% (443), Kayle 53.7% (763), Quinn 53.5% (413), Warwick 52.6% (597)
- **jungle:** Ivern 55.5% (724), Zaahen 55.0% (469), Udyr 54.8% (745), Zac 53.9% (999), Nidalee 53.3% (2,071)
- **mid:** Pantheon 54.5% (517), Qiyana 54.0% (923), Katarina 53.1% (2,161), Hwei 52.3% (1,498), Zoe 52.0% (1,320)
- **adc:** Hwei 55.7% (571), Vel'Koz 55.0% (667), Kog'Maw 53.8% (892), Yasuo 53.1% (817), Taliyah 53.0% (440)
- **support:** Morgana 55.4% (673), Poppy 53.8% (1,032), Galio 53.4% (530), Janna 53.4% (2,153), Zilean 52.6% (1,202)

To use this data in the game: `python3 tools/update_data.py --matchups <state>/rows-16.23.txt --source "Riot API, patch 26.23, Emerald+"`
Only do this once LaneLock has an approved production API key.
