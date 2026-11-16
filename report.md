# LaneLock data collector

Games counted so far, by game version: 16.21: 1,300, 16.22: 21,999.

## Version 16.22

- 21,999 games (euw1: 7,439, kr: 7,577, na1: 6,983)
- 12,861 lane matchups seen: 374 with 50+ games, 17 with 200+, 0 with 1,000+

## Version 16.21

- 1,300 games (euw1: 396, kr: 282, na1: 622)
- 3,430 lane matchups seen: 0 with 50+ games, 0 with 200+, 0 with 1,000+

## Compared with the game's current numbers (LoLalytics, patch 26.22, Emerald+)

Matchups with 100+ of our games that the game also has: 96.

- Correlation: 0.51 (1.00 would be identical)
- Average difference: 3.33 win-rate points
- Same favourite in 72% of matchups that aren't close to even

Biggest disagreements:

| Lane | Matchup | Ours | Current | Our games |
|---|---|---|---|---|
| jungle | Lee Sin vs Vi | 58.4% | 48.4% | 125 |
| mid | Ahri vs Sylas | 42.4% | 51.8% | 139 |
| jungle | Graves vs Lee Sin | 42.4% | 51.2% | 158 |
| support | Leona vs Thresh | 41.5% | 50.2% | 123 |
| support | Alistar vs Rakan | 58.9% | 50.2% | 124 |
| adc | Jinx vs Kai'Sa | 60.7% | 52.5% | 145 |
| adc | Aphelios vs Ezreal | 46.8% | 54.0% | 124 |
| adc | Aphelios vs Yunara | 44.9% | 52.1% | 167 |
| adc | Ezreal vs Lucian | 39.7% | 46.8% | 126 |
| adc | Jhin vs Zeri | 40.4% | 47.3% | 161 |

## Best champions by role (16.22, 200+ games)

- **top:** Anivia 56.7% (298), Tryndamere 54.7% (587), Sion 54.2% (1,036), Riven 54.1% (462), Shen 52.9% (753)
- **jungle:** Nidalee 54.3% (1,184), Nunu & Willump 54.1% (651), Darius 53.8% (292), Zyra 53.5% (762), Udyr 53.2% (370)
- **mid:** Riven 56.9% (232), Pantheon 56.5% (269), Ekko 54.8% (1,268), Vex 54.7% (508), Jayce 54.7% (351)
- **adc:** Vel'Koz 60.4% (346), Katarina 55.8% (224), Hwei 54.3% (383), Lux 53.6% (274), Vayne 53.5% (310)
- **support:** Elise 56.1% (371), Galio 54.6% (238), Braum 53.2% (1,166), Poppy 53.2% (489), Rell 52.7% (1,591)

To use this data in the game: `python3 tools/update_data.py --matchups <state>/rows-16.22.txt --source "Riot API, patch 26.22, Emerald+"`
Only do this once LaneLock has an approved production API key.
