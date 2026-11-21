# LaneLock data collector

Games counted so far, by game version: 16.21: 3,412, 16.22: 160,999, 16.23: 54,550.

## Version 16.23

- 54,550 games (euw1: 18,751, kr: 21,690, na1: 14,109)
- 17,429 lane matchups seen: 1,343 with 50+ games, 142 with 200+, 3 with 1,000+

## Version 16.22

- 160,999 games (euw1: 56,226, kr: 57,016, na1: 47,757)
- 24,275 lane matchups seen: 3,472 with 50+ games, 898 with 200+, 53 with 1,000+

## Version 16.21

- 3,412 games (euw1: 963, kr: 470, na1: 1,979)
- 5,971 lane matchups seen: 2 with 50+ games, 0 with 200+, 0 with 1,000+

## Compared with the game's current numbers (LoLalytics, patch 26.22, Emerald+)

Matchups with 100+ of our games that the game also has: 473.

- Correlation: 0.42 (1.00 would be identical)
- Average difference: 3.57 win-rate points
- Same favourite in 68% of matchups that aren't close to even

Biggest disagreements among matchups with 400+ of our games (smaller samples are mostly noise):

| Lane | Matchup | Ours | Current | Our games |
|---|---|---|---|---|
| jungle | Jarvan IV vs Lee Sin | 45.3% | 51.8% | 444 |
| adc | Jhin vs Lucian | 57.2% | 51.2% | 456 |
| adc | Jhin vs Zeri | 53.0% | 47.3% | 411 |
| adc | Ezreal vs Xayah | 50.4% | 45.2% | 542 |
| adc | Ezreal vs Sivir | 48.6% | 44.6% | 432 |
| adc | Ezreal vs Zeri | 40.5% | 44.2% | 462 |
| adc | Corki vs Jhin | 47.5% | 51.0% | 627 |
| jungle | Lee Sin vs Vi | 51.8% | 48.4% | 519 |
| adc | Ezreal vs Jhin | 49.1% | 45.8% | 1,804 |
| adc | Aphelios vs Kai'Sa | 56.4% | 53.2% | 406 |

## Best champions by role (16.23, regularly played picks only)

- **top:** Poppy 53.6% (582), Cho'Gath 53.4% (1,355), Quinn 53.2% (556), Warwick 52.6% (820), Kayle 52.4% (1,071)
- **jungle:** Zaahen 54.3% (644), Ivern 54.2% (944), Nidalee 53.5% (2,846), Udyr 53.0% (966), Sejuani 52.7% (759)
- **mid:** Pantheon 54.5% (685), Riven 53.7% (559), Vel'Koz 53.3% (688), Qiyana 53.1% (1,221), Zoe 52.6% (1,778)
- **adc:** Hwei 56.9% (770), Vel'Koz 55.3% (906), Aurelion Sol 53.5% (600), Kog'Maw 53.5% (1,176), Xerath 53.2% (560)
- **support:** Morgana 53.3% (903), Poppy 53.0% (1,370), Janna 52.8% (2,851), Senna 52.5% (2,899), Alistar 52.5% (6,242)

To use this data in the game: `python3 tools/update_data.py --matchups <state>/rows-16.23.txt --source "Riot API, patch 26.23, Emerald+"`
Only do this once LaneLock has an approved production API key.
