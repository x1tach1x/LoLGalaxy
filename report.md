# LaneLock data collector

Games counted so far, by game version: 16.21: 3,412, 16.22: 160,253, 16.23: 47,519.

## Version 16.23

- 47,519 games (euw1: 15,940, kr: 18,767, na1: 12,812)
- 16,679 lane matchups seen: 1,151 with 50+ games, 101 with 200+, 3 with 1,000+

## Version 16.22

- 160,253 games (euw1: 55,952, kr: 56,732, na1: 47,569)
- 24,251 lane matchups seen: 3,461 with 50+ games, 895 with 200+, 52 with 1,000+

## Version 16.21

- 3,412 games (euw1: 963, kr: 470, na1: 1,979)
- 5,971 lane matchups seen: 2 with 50+ games, 0 with 200+, 0 with 1,000+

## Compared with the game's current numbers (LoLalytics, patch 26.22, Emerald+)

Matchups with 100+ of our games that the game also has: 381.

- Correlation: 0.42 (1.00 would be identical)
- Average difference: 3.57 win-rate points
- Same favourite in 65% of matchups that aren't close to even

Biggest disagreements among matchups with 400+ of our games (smaller samples are mostly noise):

| Lane | Matchup | Ours | Current | Our games |
|---|---|---|---|---|
| adc | Corki vs Jhin | 46.0% | 51.0% | 531 |
| adc | Ezreal vs Zeri | 39.5% | 44.2% | 415 |
| adc | Ezreal vs Jhin | 49.5% | 45.8% | 1,595 |
| jungle | Lee Sin vs Vi | 51.6% | 48.4% | 455 |
| adc | Aphelios vs Ezreal | 57.2% | 54.0% | 430 |
| adc | Ezreal vs Xayah | 48.0% | 45.2% | 456 |
| support | Lulu vs Nautilus | 53.8% | 51.0% | 494 |
| adc | Caitlyn vs Jhin | 49.8% | 47.1% | 404 |
| support | Nautilus vs Rell | 45.6% | 43.3% | 406 |
| adc | Kai'Sa vs Yunara | 47.1% | 49.2% | 539 |

## Best champions by role (16.23, regularly played picks only)

- **top:** Poppy 55.0% (518), Cassiopeia 53.9% (484), Quinn 53.9% (488), Cho'Gath 53.0% (1,183), Kayle 52.7% (922)
- **jungle:** Ivern 55.3% (824), Zaahen 54.3% (556), Udyr 53.8% (844), Zac 52.9% (1,179), Nidalee 52.9% (2,411)
- **mid:** Pantheon 54.3% (602), Riven 54.2% (483), Vel'Koz 52.7% (609), Qiyana 52.6% (1,068), Zoe 52.6% (1,542)
- **adc:** Hwei 55.6% (656), Vel'Koz 55.5% (786), Aurelion Sol 54.0% (531), Kog'Maw 53.7% (1,040), Samira 53.2% (867)
- **support:** Morgana 54.3% (777), Janna 53.2% (2,483), Poppy 53.2% (1,193), Alistar 52.8% (5,422), Rell 52.4% (3,291)

To use this data in the game: `python3 tools/update_data.py --matchups <state>/rows-16.23.txt --source "Riot API, patch 26.23, Emerald+"`
Only do this once LaneLock has an approved production API key.
