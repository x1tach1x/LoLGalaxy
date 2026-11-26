# LaneLock data collector

Games counted so far, by game version: 16.21: 3,412, 16.22: 163,650, 16.23: 124,729.

## Version 16.23

- 124,729 games (euw1: 43,564, kr: 46,808, na1: 34,357)
- 22,538 lane matchups seen: 2,970 with 50+ games, 633 with 200+, 23 with 1,000+

## Version 16.22

- 163,650 games (euw1: 57,184, kr: 57,936, na1: 48,530)
- 24,374 lane matchups seen: 3,508 with 50+ games, 914 with 200+, 54 with 1,000+

## Version 16.21

- 3,412 games (euw1: 963, kr: 470, na1: 1,979)
- 5,971 lane matchups seen: 2 with 50+ games, 0 with 200+, 0 with 1,000+

## Compared with the game's current numbers (LoLalytics, patch 26.22, Emerald+)

Matchups with 100+ of our games that the game also has: 1,216.

- Correlation: 0.42 (1.00 would be identical)
- Average difference: 3.22 win-rate points
- Same favourite in 70% of matchups that aren't close to even

Biggest disagreements among matchups with 400+ of our games (smaller samples are mostly noise):

| Lane | Matchup | Ours | Current | Our games |
|---|---|---|---|---|
| adc | Yunara vs Zeri | 50.7% | 42.3% | 749 |
| mid | Ahri vs Syndra | 58.1% | 51.2% | 626 |
| adc | Ezreal vs Jinx | 52.6% | 46.1% | 715 |
| mid | Akali vs Galio | 40.4% | 46.7% | 448 |
| support | Karma vs Thresh | 42.2% | 48.4% | 649 |
| mid | Orianna vs Twisted Fate | 52.1% | 45.9% | 409 |
| support | Blitzcrank vs Leona | 53.0% | 46.9% | 545 |
| support | Nautilus vs Seraphine | 53.8% | 47.7% | 407 |
| adc | Corki vs Xayah | 51.9% | 45.9% | 653 |
| top | Jax vs Olaf | 54.3% | 48.6% | 449 |

## Best champions by role (16.23, regularly played picks only)

- **top:** Poppy 52.8% (1,492), Warwick 52.8% (1,756), Tryndamere 52.1% (3,175), Darius 52.0% (6,444), Fiora 52.0% (6,469)
- **jungle:** Udyr 53.5% (2,257), Nidalee 53.1% (6,555), Shaco 52.6% (4,588), Zyra 52.4% (4,078), Zac 52.0% (3,203)
- **mid:** Zoe 53.2% (4,126), Vel'Koz 53.1% (1,556), Ekko 52.5% (6,950), Annie 52.5% (3,270), Riven 52.4% (1,255)
- **adc:** Vel'Koz 56.0% (2,199), Aurelion Sol 54.4% (1,376), Yasuo 53.3% (2,654), Hwei 53.1% (1,881), Karthus 52.6% (1,901)
- **support:** Galio 52.7% (1,937), Elise 52.4% (2,097), Maokai 52.3% (2,420), Alistar 52.2% (14,241), Rell 52.0% (8,496)

To use this data in the game: `python3 tools/update_data.py --matchups <state>/rows-16.23.txt --source "Riot API, patch 26.23, Emerald+"`
Only do this once LaneLock has an approved production API key.
