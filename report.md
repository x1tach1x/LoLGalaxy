# LaneLock data collector

Games counted so far, by game version: 16.21: 3,412, 16.22: 133,640, 16.23: 715.

## Version 16.23

- 715 games (euw1: 3, kr: 712)
- 2,016 lane matchups seen: 1 with 50+ games, 0 with 200+, 0 with 1,000+

## Version 16.22

- 133,640 games (euw1: 46,229, kr: 46,800, na1: 40,611)
- 23,108 lane matchups seen: 3,065 with 50+ games, 701 with 200+, 30 with 1,000+

## Compared with the game's current numbers (LoLalytics, patch 26.22, Emerald+)

Not enough overlapping matchups with 100+ games yet. Run the collector for longer.

## Best champions by role (16.23, 200+ games)

- **adc:** Ezreal 49.6% (248)

To use this data in the game: `python3 tools/update_data.py --matchups <state>/rows-16.23.txt --source "Riot API, patch 26.23, Emerald+"`
Only do this once LaneLock has an approved production API key.
