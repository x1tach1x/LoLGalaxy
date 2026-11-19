# LaneLock data collector

Games counted so far, by game version: 16.21: 3,412, 16.22: 136,144, 16.23: 4,307.

## Version 16.23

- 4,307 games (euw1: 1,152, kr: 2,022, na1: 1,133)
- 6,363 lane matchups seen: 12 with 50+ games, 0 with 200+, 0 with 1,000+

## Version 16.22

- 136,144 games (euw1: 47,091, kr: 47,605, na1: 41,448)
- 23,226 lane matchups seen: 3,108 with 50+ games, 715 with 200+, 33 with 1,000+

## Version 16.21

- 3,412 games (euw1: 963, kr: 470, na1: 1,979)
- 5,971 lane matchups seen: 2 with 50+ games, 0 with 200+, 0 with 1,000+

## Compared with the game's current numbers (LoLalytics, patch 26.22, Emerald+)

Matchups with 100+ of our games that the game also has: 1,308.

- Correlation: 0.47 (1.00 would be identical)
- Average difference: 3.09 win-rate points
- Same favourite in 71% of matchups that aren't close to even

Biggest disagreements among matchups with 400+ of our games (smaller samples are mostly noise):

| Lane | Matchup | Ours | Current | Our games |
|---|---|---|---|---|
| adc | Draven vs Yunara | 58.7% | 48.8% | 431 |
| jungle | Hecarim vs Qiyana | 49.3% | 57.9% | 497 |
| mid | Ahri vs Akali | 47.8% | 55.0% | 429 |
| support | Alistar vs Braum | 56.6% | 49.9% | 489 |
| support | Bard vs Lulu | 57.4% | 51.1% | 657 |
| jungle | Lee Sin vs Wukong | 52.4% | 46.5% | 632 |
| adc | Draven vs Jhin | 55.7% | 50.0% | 713 |
| adc | Yunara vs Zeri | 47.8% | 42.3% | 890 |
| adc | Ezreal vs Zeri | 49.4% | 44.2% | 636 |
| adc | Ezreal vs Jinx | 51.1% | 46.1% | 704 |

## Best champions by role (16.22, regularly played picks only)

- **top:** Riven 53.3% (2,947), Zed 52.7% (1,427), Poppy 52.6% (1,520), Singed 52.1% (3,563), Irelia 52.1% (6,598)
- **jungle:** Zyra 54.1% (4,690), Rek'Sai 53.4% (3,663), Nunu & Willump 53.1% (3,684), Shaco 52.9% (5,003), Skarner 52.8% (2,083)
- **mid:** Pantheon 53.3% (1,764), Lissandra 52.6% (6,076), Zoe 52.5% (4,032), Aurora 52.3% (4,996), Ekko 52.3% (7,843)
- **adc:** Vel'Koz 54.5% (2,298), Lux 53.3% (1,534), Karthus 53.2% (1,900), Hwei 52.5% (2,059), Swain 52.1% (2,260)
- **support:** Galio 53.3% (1,515), Taric 52.8% (2,293), Rell 52.6% (9,632), Sona 52.6% (5,196), Elise 52.4% (2,150)

To use this data in the game: `python3 tools/update_data.py --matchups <state>/rows-16.22.txt --source "Riot API, patch 26.22, Emerald+"`
Only do this once LaneLock has an approved production API key.
