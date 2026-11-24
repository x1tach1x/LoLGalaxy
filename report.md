# LaneLock data collector

Games counted so far, by game version: 16.21: 3,412, 16.22: 163,007, 16.23: 88,956.

## Version 16.23

- 88,956 games (euw1: 31,223, kr: 34,000, na1: 23,733)
- 20,379 lane matchups seen: 2,248 with 50+ games, 352 with 200+, 9 with 1,000+

## Version 16.22

- 163,007 games (euw1: 56,978, kr: 57,733, na1: 48,296)
- 24,353 lane matchups seen: 3,499 with 50+ games, 910 with 200+, 53 with 1,000+

## Version 16.21

- 3,412 games (euw1: 963, kr: 470, na1: 1,979)
- 5,971 lane matchups seen: 2 with 50+ games, 0 with 200+, 0 with 1,000+

## Compared with the game's current numbers (LoLalytics, patch 26.22, Emerald+)

Matchups with 100+ of our games that the game also has: 859.

- Correlation: 0.45 (1.00 would be identical)
- Average difference: 3.29 win-rate points
- Same favourite in 70% of matchups that aren't close to even

Biggest disagreements among matchups with 400+ of our games (smaller samples are mostly noise):

| Lane | Matchup | Ours | Current | Our games |
|---|---|---|---|---|
| adc | Yunara vs Zeri | 51.2% | 42.3% | 539 |
| support | Karma vs Thresh | 40.3% | 48.4% | 437 |
| adc | Ezreal vs Jinx | 53.2% | 46.1% | 541 |
| adc | Corki vs Xayah | 52.5% | 45.9% | 455 |
| mid | Ahri vs Syndra | 57.6% | 51.2% | 446 |
| support | Alistar vs Thresh | 56.9% | 50.8% | 638 |
| adc | Draven vs Jhin | 55.6% | 50.0% | 432 |
| support | Bard vs Nautilus | 54.5% | 49.1% | 554 |
| adc | Jhin vs Zeri | 52.6% | 47.3% | 673 |
| jungle | Jarvan IV vs Lee Sin | 46.7% | 51.8% | 687 |

## Best champions by role (16.23, regularly played picks only)

- **top:** Poppy 53.4% (1,005), Quinn 53.1% (947), Warwick 52.5% (1,317), Darius 52.4% (4,543), Kled 52.1% (1,840)
- **jungle:** Nidalee 53.4% (4,704), Udyr 53.2% (1,608), Zaahen 53.0% (1,118), Zac 52.7% (2,282), Ivern 52.5% (1,584)
- **mid:** Riven 53.3% (911), Vel'Koz 53.2% (1,133), Zoe 52.9% (2,962), Pantheon 52.3% (1,124), Ekko 52.2% (4,904)
- **adc:** Vel'Koz 56.2% (1,507), Aurelion Sol 54.8% (983), Hwei 54.3% (1,303), Yasuo 53.2% (1,848), Kog'Maw 52.8% (1,955)
- **support:** Elise 52.8% (1,495), Zilean 52.6% (2,724), Rell 52.5% (6,224), Galio 52.4% (1,333), Maokai 52.4% (1,697)

To use this data in the game: `python3 tools/update_data.py --matchups <state>/rows-16.23.txt --source "Riot API, patch 26.23, Emerald+"`
Only do this once LaneLock has an approved production API key.
