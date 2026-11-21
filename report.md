# LaneLock data collector

Games counted so far, by game version: 16.21: 3,412, 16.22: 159,302, 16.23: 45,372.

## Version 16.23

- 45,372 games (euw1: 15,311, kr: 17,768, na1: 12,293)
- 16,441 lane matchups seen: 1,079 with 50+ games, 96 with 200+, 3 with 1,000+

## Version 16.22

- 159,302 games (euw1: 55,581, kr: 56,376, na1: 47,345)
- 24,218 lane matchups seen: 3,448 with 50+ games, 886 with 200+, 51 with 1,000+

## Version 16.21

- 3,412 games (euw1: 963, kr: 470, na1: 1,979)
- 5,971 lane matchups seen: 2 with 50+ games, 0 with 200+, 0 with 1,000+

## Compared with the game's current numbers (LoLalytics, patch 26.22, Emerald+)

Matchups with 100+ of our games that the game also has: 347.

- Correlation: 0.42 (1.00 would be identical)
- Average difference: 3.52 win-rate points
- Same favourite in 67% of matchups that aren't close to even

Biggest disagreements among matchups with 400+ of our games (smaller samples are mostly noise):

| Lane | Matchup | Ours | Current | Our games |
|---|---|---|---|---|
| adc | Corki vs Jhin | 45.8% | 51.0% | 513 |
| adc | Ezreal vs Jhin | 49.3% | 45.8% | 1,529 |
| jungle | Lee Sin vs Vi | 51.7% | 48.4% | 422 |
| adc | Aphelios vs Ezreal | 56.9% | 54.0% | 411 |
| adc | Ezreal vs Xayah | 47.9% | 45.2% | 432 |
| support | Lulu vs Nautilus | 53.7% | 51.0% | 477 |
| adc | Kai'Sa vs Yunara | 47.0% | 49.2% | 515 |
| adc | Jhin vs Yunara | 52.7% | 50.7% | 573 |
| adc | Jhin vs Kai'Sa | 46.7% | 48.6% | 1,341 |
| support | Karma vs Nautilus | 46.2% | 47.7% | 413 |

## Best champions by role (16.23, regularly played picks only)

- **top:** Poppy 54.9% (492), Cassiopeia 54.1% (466), Quinn 53.7% (462), Kayle 53.0% (862), Darius 52.9% (2,307)
- **jungle:** Ivern 55.2% (791), Zaahen 54.6% (520), Udyr 53.8% (812), Zac 53.3% (1,123), Nidalee 52.9% (2,289)
- **mid:** Riven 54.1% (464), Pantheon 53.9% (579), Vel'Koz 53.0% (577), Qiyana 52.9% (1,024), Katarina 52.6% (2,401)
- **adc:** Vel'Koz 55.6% (756), Hwei 55.3% (631), Kog'Maw 54.0% (998), Aurelion Sol 53.8% (507), Samira 53.3% (809)
- **support:** Morgana 54.3% (744), Poppy 53.3% (1,137), Janna 53.1% (2,393), Alistar 52.7% (5,195), Zilean 52.4% (1,353)

To use this data in the game: `python3 tools/update_data.py --matchups <state>/rows-16.23.txt --source "Riot API, patch 26.23, Emerald+"`
Only do this once LaneLock has an approved production API key.
