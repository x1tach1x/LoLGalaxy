# LaneLock data collector

Games counted so far, by game version: 16.21: 3,183, 16.22: 106,428, 16.23: 53.

## Version 16.23

- 53 games (kr: 53)
- 231 lane matchups seen: 0 with 50+ games, 0 with 200+, 0 with 1,000+

## Version 16.22

- 106,428 games (euw1: 35,743, kr: 36,703, na1: 33,982)
- 21,607 lane matchups seen: 2,585 with 50+ games, 492 with 200+, 14 with 1,000+

## Compared with the game's current numbers (LoLalytics, patch 26.22, Emerald+)

Not enough overlapping matchups with 100+ games yet. Run the collector for longer.

## Best champions by role (16.23, 200+ games)

No champion has 200+ games in one role yet.

To use this data in the game: `python3 tools/update_data.py --matchups <state>/rows-16.23.txt --source "Riot API, patch 26.23, Emerald+"`
Only do this once LaneLock has an approved production API key.
