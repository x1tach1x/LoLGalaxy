# LaneLock data collector

Games counted so far, by game version: 16.21: 2,603, 16.22: 70,856.

## Version 16.22

- 70,856 games (euw1: 23,693, kr: 24,345, na1: 22,818)
- 19,130 lane matchups seen: 1,795 with 50+ games, 244 with 200+, 6 with 1,000+

## Version 16.21

- 2,603 games (euw1: 804, kr: 470, na1: 1,329)
- 5,140 lane matchups seen: 1 with 50+ games, 0 with 200+, 0 with 1,000+

## Compared with the game's current numbers (LoLalytics, patch 26.22, Emerald+)

Matchups with 100+ of our games that the game also has: 676.

- Correlation: 0.49 (1.00 would be identical)
- Average difference: 3.34 win-rate points
- Same favourite in 74% of matchups that aren't close to even

Biggest disagreements:

| Lane | Matchup | Ours | Current | Our games |
|---|---|---|---|---|
| adc | Kalista vs Miss Fortune | 58.5% | 43.7% | 142 |
| adc | Sivir vs Yunara | 39.3% | 52.8% | 201 |
| top | Gangplank vs Olaf | 61.1% | 48.8% | 108 |
| mid | Kassadin vs Syndra | 39.8% | 52.1% | 113 |
| top | Jax vs Jayce | 61.6% | 49.8% | 138 |
| mid | Yasuo vs Zed | 38.8% | 50.5% | 152 |
| jungle | Sylas vs Vi | 60.7% | 49.5% | 112 |
| top | Gangplank vs Irelia | 60.0% | 48.9% | 105 |
| jungle | Kha'Zix vs Naafiri | 53.2% | 42.6% | 218 |
| jungle | Graves vs Naafiri | 58.3% | 47.6% | 103 |

## Best champions by role (16.22, 200+ games)

- **top:** Zilean 57.4% (263), Zoe 56.5% (322), Qiyana 55.7% (210), Kalista 55.1% (227), Akshan 54.5% (290)
- **jungle:** Zyra 54.5% (2,480), Skarner 54.5% (1,052), Olaf 53.3% (441), Nunu & Willump 53.0% (1,965), Nidalee 52.9% (3,636)
- **mid:** Singed 55.6% (261), Pantheon 54.0% (900), Gragas 54.0% (300), Riven 53.6% (696), Ekko 53.2% (4,150)
- **adc:** Vel'Koz 56.7% (1,237), Ekko 56.6% (249), Vladimir 54.4% (452), Yone 54.0% (328), Lux 53.7% (872)
- **support:** Galio 55.1% (759), Elise 53.5% (1,145), Alistar 52.8% (8,414), Leona 52.4% (6,127), Rell 52.1% (4,998)

To use this data in the game: `python3 tools/update_data.py --matchups <state>/rows-16.22.txt --source "Riot API, patch 26.22, Emerald+"`
Only do this once LaneLock has an approved production API key.
