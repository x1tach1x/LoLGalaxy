# LaneLock data collector

Games counted so far, by game version: 16.21: 1,699, 16.22: 33,102.

## Version 16.22

- 33,102 games (euw1: 11,185, kr: 11,357, na1: 10,560)
- 14,913 lane matchups seen: 713 with 50+ games, 55 with 200+, 0 with 1,000+

## Version 16.21

- 1,699 games (euw1: 492, kr: 372, na1: 835)
- 4,038 lane matchups seen: 0 with 50+ games, 0 with 200+, 0 with 1,000+

## Compared with the game's current numbers (LoLalytics, patch 26.22, Emerald+)

Matchups with 100+ of our games that the game also has: 212.

- Correlation: 0.44 (1.00 would be identical)
- Average difference: 3.45 win-rate points
- Same favourite in 69% of matchups that aren't close to even

Biggest disagreements:

| Lane | Matchup | Ours | Current | Our games |
|---|---|---|---|---|
| adc | Kai'Sa vs Miss Fortune | 35.9% | 49.2% | 131 |
| jungle | Hecarim vs Qiyana | 45.4% | 57.9% | 119 |
| mid | Sylas vs Syndra | 59.8% | 49.8% | 117 |
| mid | Akali vs Twisted Fate | 53.7% | 43.7% | 121 |
| adc | Corki vs Xayah | 55.7% | 45.9% | 140 |
| support | Leona vs Thresh | 41.0% | 50.2% | 205 |
| support | Leona vs Nami | 59.3% | 50.4% | 113 |
| adc | Sivir vs Yunara | 43.9% | 52.8% | 107 |
| adc | Ashe vs Kai'Sa | 42.3% | 50.9% | 123 |
| support | Lulu vs Sona | 54.8% | 46.2% | 124 |

## Best champions by role (16.22, 200+ games)

- **top:** Anivia 55.9% (458), Wukong 54.2% (277), Tryndamere 53.8% (898), Riven 53.4% (728), Kennen 52.9% (947)
- **jungle:** Nidalee 54.3% (1,756), Darius 53.9% (421), Sejuani 53.7% (393), Skarner 53.6% (489), Zyra 53.3% (1,140)
- **mid:** Jayce 55.5% (533), Tryndamere 55.0% (238), Pantheon 54.8% (405), Ekko 54.6% (1,931), Riven 54.6% (328)
- **adc:** Vel'Koz 58.8% (551), Vladimir 57.9% (209), Nilah 55.2% (288), Vayne 54.2% (472), Karthus 54.2% (454)
- **support:** Elise 55.3% (544), Galio 53.5% (346), Soraka 53.3% (1,248), Rell 53.2% (2,379), Poppy 53.2% (758)

To use this data in the game: `python3 tools/update_data.py --matchups <state>/rows-16.22.txt --source "Riot API, patch 26.22, Emerald+"`
Only do this once LaneLock has an approved production API key.
