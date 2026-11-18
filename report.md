# LaneLock data collector

Games counted so far, by game version: 16.21: 3,412, 16.22: 133,640, 16.23: 715.

## Version 16.23

- 715 games (euw1: 3, kr: 712)
- 2,016 lane matchups seen: 1 with 50+ games, 0 with 200+, 0 with 1,000+

## Version 16.22

- 133,640 games (euw1: 46,229, kr: 46,800, na1: 40,611)
- 23,108 lane matchups seen: 3,065 with 50+ games, 701 with 200+, 30 with 1,000+

## Version 16.21

- 3,412 games (euw1: 963, kr: 470, na1: 1,979)
- 5,971 lane matchups seen: 2 with 50+ games, 0 with 200+, 0 with 1,000+

## Compared with the game's current numbers (LoLalytics, patch 26.22, Emerald+)

Matchups with 100+ of our games that the game also has: 1,289.

- Correlation: 0.47 (1.00 would be identical)
- Average difference: 3.11 win-rate points
- Same favourite in 71% of matchups that aren't close to even

Biggest disagreements among matchups with 400+ of our games (smaller samples are mostly noise):

| Lane | Matchup | Ours | Current | Our games |
|---|---|---|---|---|
| adc | Draven vs Yunara | 58.6% | 48.8% | 420 |
| jungle | Hecarim vs Qiyana | 49.3% | 57.9% | 491 |
| support | Alistar vs Braum | 57.1% | 49.9% | 478 |
| mid | Ahri vs Akali | 48.0% | 55.0% | 421 |
| support | Bard vs Lulu | 57.6% | 51.1% | 648 |
| adc | Draven vs Jhin | 56.1% | 50.0% | 697 |
| jungle | Lee Sin vs Wukong | 52.1% | 46.5% | 620 |
| adc | Yunara vs Zeri | 47.8% | 42.3% | 880 |
| adc | Miss Fortune vs Yunara | 46.8% | 52.1% | 419 |
| adc | Ezreal vs Jinx | 51.3% | 46.1% | 688 |

## Best champions by role (16.22, regularly played picks only)

- **top:** Riven 53.4% (2,888), Poppy 52.9% (1,493), Zed 52.8% (1,408), Irelia 52.1% (6,487), Urgot 52.1% (2,892)
- **jungle:** Zyra 54.2% (4,596), Rek'Sai 53.5% (3,591), Nunu & Willump 53.2% (3,618), Skarner 53.0% (2,039), Shaco 52.9% (4,896)
- **mid:** Pantheon 53.0% (1,738), Zoe 52.6% (3,960), Lissandra 52.5% (5,961), Ekko 52.3% (7,678), Aurora 52.3% (4,912)
- **adc:** Vel'Koz 54.5% (2,259), Karthus 53.4% (1,866), Lux 53.1% (1,509), Hwei 52.6% (2,020), Swain 52.1% (2,211)
- **support:** Galio 53.5% (1,476), Taric 52.9% (2,254), Rell 52.8% (9,454), Sona 52.6% (5,100), Elise 52.4% (2,124)

To use this data in the game: `python3 tools/update_data.py --matchups <state>/rows-16.22.txt --source "Riot API, patch 26.22, Emerald+"`
Only do this once LaneLock has an approved production API key.
