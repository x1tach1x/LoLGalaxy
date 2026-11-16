# LaneLock match collector

Builds LaneLock's lane matchup win rates from the official Riot API instead of third-party sites.

It samples Emerald+ ranked solo queue games (NA, EUW and KR by default) and keeps only totals:
how often each champion beat the champion opposite them in the same role, plus each champion's
win rate per role. Player names and IDs are never saved or printed; match IDs are kept only as
one-way hashes so a game is never counted twice. Totals live on the `data` branch, not on `main`,
so nothing reaches the live game until you choose to apply it.

## Running it

1. Get an API key from https://developer.riotgames.com (sign in with your Riot account).
2. In GitHub: Settings > Secrets and variables > Actions > New repository secret.
   Name it `RIOT_API_KEY` and paste the key.
3. Actions tab > **Collect match data** > **Run workflow**. Choose how many minutes to collect.
4. When it finishes, open the run to read the report: games collected, how many matchups have
   enough games, and how our numbers compare with the game's current data.

Development keys expire every 24 hours, so update the secret before each run until LaneLock's
production key is approved. With the production key, uncomment the `schedule` in
`.github/workflows/collect.yml` to collect every day.

## Using the data

Only after the production key is approved (a development key can't power a public product):

    git fetch origin data
    git show origin/data:rows-16.22.txt > rows.txt      # use the version named in the report
    python3 tools/update_data.py --matchups rows.txt --source "Riot API, patch 26.22, Emerald+"

Then commit and push. The report's last line has the exact command for the latest version.
