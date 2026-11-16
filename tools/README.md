# Updating LaneLock's data

The game's champion data lives in `play/index.html`. The homepage (`index.html`) and the daily
Discord post (`worker/src/daily.js`) keep their own copy of the tier list so they can show the
daily enemy team, and all three must match or players would see different teams.

After a patch:

1. Edit `TIERS` (and `ENEMY_WEIGHT` if needed) in `play/index.html`.
2. If you have new lane matchup win rates you're allowed to use, put them in a rows file and run
   `python3 tools/update_data.py --matchups rows.txt --source "Source, patch 26.24, Emerald+"`.
   The source text is shown to players, so keep it accurate.
3. Run `python3 tools/update_data.py --sync-tiers` to copy the tiers to the homepage and the worker.
4. `python3 tools/update_data.py --check` should say everything matches. Then commit and push.

Run `python3 tools/update_data.py --help` for the rows file format.
