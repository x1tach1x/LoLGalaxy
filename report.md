# LaneLock data collector

Games counted so far, by game version: 16.21: 3,412, 16.22: 163,415, 16.23: 112,613.

## Version 16.23

- 112,613 games (euw1: 39,421, kr: 42,897, na1: 30,295)
- 21,842 lane matchups seen: 2,735 with 50+ games, 537 with 200+, 16 with 1,000+

## Version 16.22

- 163,415 games (euw1: 57,117, kr: 57,833, na1: 48,465)
- 24,364 lane matchups seen: 3,504 with 50+ games, 912 with 200+, 54 with 1,000+

## Version 16.21

- 3,412 games (euw1: 963, kr: 470, na1: 1,979)
- 5,971 lane matchups seen: 2 with 50+ games, 0 with 200+, 0 with 1,000+

## Compared with the game's current numbers (LoLalytics, patch 26.22, Emerald+)

Matchups with 100+ of our games that the game also has: 1,098.

- Correlation: 0.43 (1.00 would be identical)
- Average difference: 3.21 win-rate points
- Same favourite in 69% of matchups that aren't close to even

Biggest disagreements among matchups with 400+ of our games (smaller samples are mostly noise):

| Lane | Matchup | Ours | Current | Our games |
|---|---|---|---|---|
| adc | Yunara vs Zeri | 51.3% | 42.3% | 674 |
| support | Karma vs Thresh | 41.1% | 48.4% | 584 |
| adc | Ezreal vs Jinx | 52.9% | 46.1% | 647 |
| mid | Twisted Fate vs Viktor | 47.7% | 54.2% | 428 |
| adc | Corki vs Xayah | 52.4% | 45.9% | 590 |
| mid | Ahri vs Syndra | 57.3% | 51.2% | 562 |
| top | Jax vs Olaf | 54.2% | 48.6% | 415 |
| support | Rakan vs Thresh | 56.5% | 51.1% | 494 |
| support | Blitzcrank vs Leona | 52.2% | 46.9% | 487 |
| support | Alistar vs Thresh | 56.0% | 50.8% | 780 |

## Best champions by role (16.23, regularly played picks only)

- **top:** Poppy 53.2% (1,328), Quinn 53.2% (1,170), Warwick 52.8% (1,592), Darius 52.2% (5,816), Fiora 52.0% (5,817)
- **jungle:** Udyr 53.7% (2,034), Nidalee 53.2% (6,033), Shaco 52.7% (4,155), Zyra 52.7% (3,680), Zac 52.3% (2,894)
- **mid:** Vel'Koz 53.4% (1,405), Zoe 52.9% (3,730), Annie 52.7% (2,925), Riven 52.7% (1,129), Ekko 52.4% (6,227)
- **adc:** Vel'Koz 55.8% (1,950), Aurelion Sol 54.8% (1,251), Hwei 53.1% (1,712), Yasuo 53.1% (2,390), Karthus 52.7% (1,682)
- **support:** Elise 52.6% (1,909), Maokai 52.3% (2,182), Alistar 52.3% (12,931), Rell 52.3% (7,795), Zilean 52.2% (3,440)

To use this data in the game: `python3 tools/update_data.py --matchups <state>/rows-16.23.txt --source "Riot API, patch 26.23, Emerald+"`
Only do this once LaneLock has an approved production API key.
