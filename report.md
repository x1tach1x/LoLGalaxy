# LaneLock data collector

Games counted so far, by game version: 16.21: 3,412, 16.22: 163,533, 16.23: 118,094.

## Version 16.23

- 118,094 games (euw1: 41,711, kr: 44,643, na1: 31,740)
- 22,155 lane matchups seen: 2,839 with 50+ games, 579 with 200+, 18 with 1,000+

## Version 16.22

- 163,533 games (euw1: 57,138, kr: 57,899, na1: 48,496)
- 24,369 lane matchups seen: 3,505 with 50+ games, 913 with 200+, 54 with 1,000+

## Version 16.21

- 3,412 games (euw1: 963, kr: 470, na1: 1,979)
- 5,971 lane matchups seen: 2 with 50+ games, 0 with 200+, 0 with 1,000+

## Compared with the game's current numbers (LoLalytics, patch 26.22, Emerald+)

Matchups with 100+ of our games that the game also has: 1,138.

- Correlation: 0.44 (1.00 would be identical)
- Average difference: 3.19 win-rate points
- Same favourite in 71% of matchups that aren't close to even

Biggest disagreements among matchups with 400+ of our games (smaller samples are mostly noise):

| Lane | Matchup | Ours | Current | Our games |
|---|---|---|---|---|
| adc | Yunara vs Zeri | 51.3% | 42.3% | 700 |
| adc | Ezreal vs Jinx | 53.1% | 46.1% | 671 |
| support | Karma vs Thresh | 41.7% | 48.4% | 617 |
| mid | Akali vs Galio | 40.1% | 46.7% | 419 |
| adc | Corki vs Xayah | 52.0% | 45.9% | 615 |
| mid | Ahri vs Syndra | 57.2% | 51.2% | 598 |
| mid | Twisted Fate vs Viktor | 48.2% | 54.2% | 440 |
| top | Jax vs Olaf | 54.3% | 48.6% | 429 |
| support | Blitzcrank vs Nami | 56.2% | 50.8% | 400 |
| adc | Ezreal vs Xayah | 50.2% | 45.2% | 1,124 |

## Best champions by role (16.23, regularly played picks only)

- **top:** Warwick 52.9% (1,670), Poppy 52.8% (1,409), Quinn 52.1% (1,222), Fiora 52.0% (6,102), Darius 52.0% (6,104)
- **jungle:** Udyr 53.6% (2,138), Nidalee 53.1% (6,275), Shaco 52.9% (4,359), Zyra 52.4% (3,875), Zac 52.2% (3,029)
- **mid:** Vel'Koz 53.3% (1,484), Zoe 52.9% (3,895), Annie 52.7% (3,089), Riven 52.7% (1,187), Ekko 52.5% (6,557)
- **adc:** Vel'Koz 55.8% (2,063), Aurelion Sol 54.6% (1,303), Yasuo 53.2% (2,504), Hwei 53.0% (1,786), Kog'Maw 52.6% (2,551)
- **support:** Elise 52.8% (1,996), Maokai 52.7% (2,300), Alistar 52.4% (13,518), Rell 52.2% (8,115), Galio 52.2% (1,831)

To use this data in the game: `python3 tools/update_data.py --matchups <state>/rows-16.23.txt --source "Riot API, patch 26.23, Emerald+"`
Only do this once LaneLock has an approved production API key.
