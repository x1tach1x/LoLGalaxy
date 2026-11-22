# LaneLock data collector

Games counted so far, by game version: 16.21: 3,412, 16.22: 161,667, 16.23: 61,425.

## Version 16.23

- 61,425 games (euw1: 20,841, kr: 23,908, na1: 16,676)
- 18,133 lane matchups seen: 1,552 with 50+ games, 171 with 200+, 4 with 1,000+

## Version 16.22

- 161,667 games (euw1: 56,489, kr: 57,218, na1: 47,960)
- 24,305 lane matchups seen: 3,481 with 50+ games, 904 with 200+, 53 with 1,000+

## Version 16.21

- 3,412 games (euw1: 963, kr: 470, na1: 1,979)
- 5,971 lane matchups seen: 2 with 50+ games, 0 with 200+, 0 with 1,000+

## Compared with the game's current numbers (LoLalytics, patch 26.22, Emerald+)

Matchups with 100+ of our games that the game also has: 560.

- Correlation: 0.43 (1.00 would be identical)
- Average difference: 3.51 win-rate points
- Same favourite in 69% of matchups that aren't close to even

Biggest disagreements among matchups with 400+ of our games (smaller samples are mostly noise):

| Lane | Matchup | Ours | Current | Our games |
|---|---|---|---|---|
| adc | Jhin vs Lucian | 57.3% | 51.2% | 518 |
| support | Alistar vs Thresh | 56.9% | 50.8% | 429 |
| support | Bard vs Nautilus | 55.1% | 49.1% | 405 |
| jungle | Jarvan IV vs Lee Sin | 46.1% | 51.8% | 499 |
| adc | Jhin vs Zeri | 52.9% | 47.3% | 471 |
| adc | Ezreal vs Xayah | 50.3% | 45.2% | 626 |
| adc | Corki vs Yunara | 48.8% | 52.8% | 434 |
| adc | Aphelios vs Kai'Sa | 56.7% | 53.2% | 448 |
| support | Leona vs Nautilus | 50.6% | 53.9% | 484 |
| jungle | Lee Sin vs Vi | 51.6% | 48.4% | 572 |

## Best champions by role (16.23, regularly played picks only)

- **top:** Poppy 54.4% (654), Cho'Gath 52.9% (1,560), Kayle 52.9% (1,214), Quinn 52.7% (640), Warwick 52.6% (919)
- **jungle:** Zaahen 54.5% (750), Nidalee 53.6% (3,157), Ivern 53.2% (1,069), Zac 53.0% (1,544), Sejuani 52.9% (871)
- **mid:** Vel'Koz 54.0% (766), Pantheon 53.8% (771), Riven 53.0% (628), Qiyana 52.9% (1,379), Zoe 52.9% (1,983)
- **adc:** Hwei 56.3% (868), Vel'Koz 54.9% (1,031), Aurelion Sol 54.2% (679), Kog'Maw 53.5% (1,342), Xerath 53.2% (628)
- **support:** Poppy 53.3% (1,518), Zilean 52.9% (1,854), Morgana 52.8% (1,007), Janna 52.6% (3,242), Rell 52.5% (4,270)

To use this data in the game: `python3 tools/update_data.py --matchups <state>/rows-16.23.txt --source "Riot API, patch 26.23, Emerald+"`
Only do this once LaneLock has an approved production API key.
