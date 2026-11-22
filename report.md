# LaneLock data collector

Games counted so far, by game version: 16.21: 3,412, 16.22: 162,536, 16.23: 71,269.

## Version 16.23

- 71,269 games (euw1: 24,751, kr: 27,931, na1: 18,587)
- 18,994 lane matchups seen: 1,831 with 50+ games, 225 with 200+, 5 with 1,000+

## Version 16.22

- 162,536 games (euw1: 56,807, kr: 57,559, na1: 48,170)
- 24,334 lane matchups seen: 3,495 with 50+ games, 908 with 200+, 53 with 1,000+

## Version 16.21

- 3,412 games (euw1: 963, kr: 470, na1: 1,979)
- 5,971 lane matchups seen: 2 with 50+ games, 0 with 200+, 0 with 1,000+

## Compared with the game's current numbers (LoLalytics, patch 26.22, Emerald+)

Matchups with 100+ of our games that the game also has: 676.

- Correlation: 0.44 (1.00 would be identical)
- Average difference: 3.47 win-rate points
- Same favourite in 70% of matchups that aren't close to even

Biggest disagreements among matchups with 400+ of our games (smaller samples are mostly noise):

| Lane | Matchup | Ours | Current | Our games |
|---|---|---|---|---|
| adc | Yunara vs Zeri | 51.6% | 42.3% | 438 |
| adc | Ezreal vs Jinx | 54.5% | 46.1% | 442 |
| adc | Ezreal vs Xayah | 51.3% | 45.2% | 706 |
| support | Alistar vs Thresh | 56.6% | 50.8% | 518 |
| support | Bard vs Nautilus | 54.6% | 49.1% | 454 |
| adc | Jhin vs Lucian | 56.1% | 51.2% | 606 |
| adc | Jhin vs Zeri | 52.0% | 47.3% | 542 |
| jungle | Jarvan IV vs Lee Sin | 47.1% | 51.8% | 560 |
| jungle | Lee Sin vs Naafiri | 50.2% | 46.2% | 470 |
| adc | Corki vs Yunara | 49.0% | 52.8% | 516 |

## Best champions by role (16.23, regularly played picks only)

- **top:** Poppy 53.4% (766), Quinn 52.9% (762), Cho'Gath 52.8% (1,810), Kayle 52.6% (1,428), Warwick 52.6% (1,058)
- **jungle:** Zaahen 54.5% (865), Nidalee 53.3% (3,704), Ivern 53.2% (1,230), Zac 52.9% (1,835), Udyr 52.7% (1,316)
- **mid:** Vel'Koz 54.2% (899), Pantheon 53.8% (894), Riven 53.5% (761), Zoe 52.8% (2,322), Qiyana 52.2% (1,578)
- **adc:** Hwei 55.3% (1,015), Vel'Koz 54.4% (1,205), Aurelion Sol 54.1% (789), Yasuo 53.2% (1,458), Xerath 52.7% (719)
- **support:** Morgana 53.0% (1,179), Galio 52.9% (1,015), Zilean 52.7% (2,144), Elise 52.4% (1,206), Janna 52.4% (3,728)

To use this data in the game: `python3 tools/update_data.py --matchups <state>/rows-16.23.txt --source "Riot API, patch 26.23, Emerald+"`
Only do this once LaneLock has an approved production API key.
