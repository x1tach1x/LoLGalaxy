# LaneLock data collector

Games counted so far, by game version: 16.21: 3,412, 16.22: 146,326, 16.23: 18,263.

## Version 16.23

- 18,263 games (euw1: 5,965, kr: 8,189, na1: 4,109)
- 11,755 lane matchups seen: 260 with 50+ games, 13 with 200+, 0 with 1,000+

## Version 16.22

- 146,326 games (euw1: 50,765, kr: 51,269, na1: 44,292)
- 23,685 lane matchups seen: 3,245 with 50+ games, 793 with 200+, 39 with 1,000+

## Version 16.21

- 3,412 games (euw1: 963, kr: 470, na1: 1,979)
- 5,971 lane matchups seen: 2 with 50+ games, 0 with 200+, 0 with 1,000+

## Compared with the game's current numbers (LoLalytics, patch 26.22, Emerald+)

Matchups with 100+ of our games that the game also has: 1,408.

- Correlation: 0.48 (1.00 would be identical)
- Average difference: 3.05 win-rate points
- Same favourite in 72% of matchups that aren't close to even

Biggest disagreements among matchups with 400+ of our games (smaller samples are mostly noise):

| Lane | Matchup | Ours | Current | Our games |
|---|---|---|---|---|
| adc | Draven vs Yunara | 58.0% | 48.8% | 457 |
| jungle | Hecarim vs Qiyana | 50.6% | 57.9% | 547 |
| mid | Akali vs Yasuo | 42.5% | 49.4% | 428 |
| mid | Ahri vs Akali | 48.7% | 55.0% | 460 |
| support | Alistar vs Braum | 56.2% | 49.9% | 527 |
| jungle | Lee Sin vs Wukong | 52.5% | 46.5% | 680 |
| adc | Draven vs Jhin | 55.8% | 50.0% | 762 |
| support | Milio vs Nautilus | 44.7% | 50.5% | 409 |
| jungle | Kha'Zix vs Naafiri | 48.2% | 42.6% | 415 |
| adc | Ezreal vs Zeri | 49.6% | 44.2% | 677 |

## Best champions by role (16.22, regularly played picks only)

- **top:** Poppy 53.5% (1,642), Riven 53.2% (3,191), Zed 52.9% (1,535), Anivia 52.3% (1,925), Singed 52.1% (3,852)
- **jungle:** Zyra 54.2% (5,020), Nunu & Willump 53.4% (3,943), Rek'Sai 53.3% (3,921), Skarner 52.8% (2,222), Shaco 52.8% (5,336)
- **mid:** Pantheon 53.7% (1,885), Lissandra 52.4% (6,533), Zoe 52.3% (4,339), Ekko 52.3% (8,414), Jayce 52.0% (2,288)
- **adc:** Vel'Koz 54.2% (2,437), Lux 53.7% (1,649), Karthus 53.2% (2,021), Hwei 52.7% (2,188), Swain 52.1% (2,413)
- **support:** Galio 53.1% (1,625), Rell 53.0% (10,321), Taric 52.7% (2,445), Sona 52.6% (5,609), Elise 52.3% (2,306)

To use this data in the game: `python3 tools/update_data.py --matchups <state>/rows-16.22.txt --source "Riot API, patch 26.22, Emerald+"`
Only do this once LaneLock has an approved production API key.
