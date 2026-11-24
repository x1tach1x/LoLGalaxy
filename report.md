# LaneLock data collector

Games counted so far, by game version: 16.21: 3,412, 16.22: 163,179, 16.23: 95,162.

## Version 16.23

- 95,162 games (euw1: 32,791, kr: 36,418, na1: 25,953)
- 20,759 lane matchups seen: 2,383 with 50+ games, 406 with 200+, 9 with 1,000+

## Version 16.22

- 163,179 games (euw1: 57,040, kr: 57,770, na1: 48,369)
- 24,357 lane matchups seen: 3,502 with 50+ games, 911 with 200+, 53 with 1,000+

## Version 16.21

- 3,412 games (euw1: 963, kr: 470, na1: 1,979)
- 5,971 lane matchups seen: 2 with 50+ games, 0 with 200+, 0 with 1,000+

## Compared with the game's current numbers (LoLalytics, patch 26.22, Emerald+)

Matchups with 100+ of our games that the game also has: 928.

- Correlation: 0.46 (1.00 would be identical)
- Average difference: 3.24 win-rate points
- Same favourite in 71% of matchups that aren't close to even

Biggest disagreements among matchups with 400+ of our games (smaller samples are mostly noise):

| Lane | Matchup | Ours | Current | Our games |
|---|---|---|---|---|
| adc | Yunara vs Zeri | 50.9% | 42.3% | 570 |
| support | Karma vs Thresh | 40.7% | 48.4% | 469 |
| mid | Ahri vs Syndra | 58.0% | 51.2% | 471 |
| adc | Ezreal vs Jinx | 52.8% | 46.1% | 574 |
| support | Rakan vs Thresh | 57.7% | 51.1% | 414 |
| support | Alistar vs Thresh | 56.9% | 50.8% | 671 |
| adc | Corki vs Xayah | 51.6% | 45.9% | 498 |
| adc | Draven vs Jhin | 55.7% | 50.0% | 449 |
| support | Blitzcrank vs Leona | 52.5% | 46.9% | 421 |
| adc | Jhin vs Zeri | 52.8% | 47.3% | 721 |

## Best champions by role (16.23, regularly played picks only)

- **top:** Quinn 53.4% (997), Poppy 53.2% (1,093), Darius 52.3% (4,881), Kled 52.1% (1,960), Fiora 52.0% (4,874)
- **jungle:** Nidalee 53.4% (5,029), Udyr 53.2% (1,713), Zac 52.9% (2,455), Shaco 52.7% (3,498), Zaahen 52.6% (1,229)
- **mid:** Riven 53.7% (955), Vel'Koz 53.3% (1,204), Zoe 53.0% (3,181), Annie 52.3% (2,419), Ekko 52.3% (5,234)
- **adc:** Vel'Koz 56.6% (1,595), Aurelion Sol 54.4% (1,052), Hwei 53.9% (1,393), Yasuo 53.3% (1,995), Lux 52.7% (979)
- **support:** Elise 53.1% (1,587), Zilean 52.7% (2,909), Galio 52.6% (1,438), Rell 52.4% (6,626), Alistar 52.2% (10,884)

To use this data in the game: `python3 tools/update_data.py --matchups <state>/rows-16.23.txt --source "Riot API, patch 26.23, Emerald+"`
Only do this once LaneLock has an approved production API key.
