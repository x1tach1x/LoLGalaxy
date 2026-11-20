# LaneLock data collector

Games counted so far, by game version: 16.21: 3,412, 16.22: 152,731, 16.23: 27,070.

## Version 16.23

- 27,070 games (euw1: 9,144, kr: 10,740, na1: 7,186)
- 13,646 lane matchups seen: 541 with 50+ games, 34 with 200+, 1 with 1,000+

## Version 16.22

- 152,731 games (euw1: 53,162, kr: 53,796, na1: 45,773)
- 23,959 lane matchups seen: 3,344 with 50+ games, 837 with 200+, 43 with 1,000+

## Version 16.21

- 3,412 games (euw1: 963, kr: 470, na1: 1,979)
- 5,971 lane matchups seen: 2 with 50+ games, 0 with 200+, 0 with 1,000+

## Compared with the game's current numbers (LoLalytics, patch 26.22, Emerald+)

Matchups with 100+ of our games that the game also has: 1,449.

- Correlation: 0.47 (1.00 would be identical)
- Average difference: 3.05 win-rate points
- Same favourite in 72% of matchups that aren't close to even

Biggest disagreements among matchups with 400+ of our games (smaller samples are mostly noise):

| Lane | Matchup | Ours | Current | Our games |
|---|---|---|---|---|
| adc | Sivir vs Yunara | 43.4% | 52.8% | 424 |
| adc | Draven vs Yunara | 57.5% | 48.8% | 475 |
| jungle | Hecarim vs Qiyana | 50.3% | 57.9% | 565 |
| mid | Ahri vs Akali | 48.3% | 55.0% | 489 |
| support | Alistar vs Braum | 56.3% | 49.9% | 552 |
| support | Milio vs Nautilus | 44.2% | 50.5% | 430 |
| mid | Akali vs Yasuo | 43.2% | 49.4% | 447 |
| mid | Ahri vs Lissandra | 45.1% | 51.0% | 408 |
| jungle | Kha'Zix vs Naafiri | 48.4% | 42.6% | 430 |
| adc | Yunara vs Zeri | 47.8% | 42.3% | 994 |

## Best champions by role (16.22, regularly played picks only)

- **top:** Poppy 53.1% (1,724), Riven 52.9% (3,328), Anivia 52.7% (2,012), Zed 52.4% (1,595), Fiora 52.0% (8,197)
- **jungle:** Zyra 54.3% (5,228), Nunu & Willump 53.5% (4,113), Rek'Sai 53.4% (4,057), Skarner 53.0% (2,312), Nidalee 52.8% (7,685)
- **mid:** Pantheon 54.2% (1,963), Lissandra 52.4% (6,838), Zoe 52.3% (4,540), Ekko 52.3% (8,755), LeBlanc 52.0% (8,017)
- **adc:** Vel'Koz 54.3% (2,529), Karthus 53.6% (2,076), Lux 53.5% (1,706), Swain 52.5% (2,501), Hwei 52.3% (2,275)
- **support:** Galio 53.2% (1,696), Rell 53.1% (10,746), Taric 52.6% (2,536), Sona 52.5% (5,827), Alistar 52.2% (17,559)

To use this data in the game: `python3 tools/update_data.py --matchups <state>/rows-16.22.txt --source "Riot API, patch 26.22, Emerald+"`
Only do this once LaneLock has an approved production API key.
