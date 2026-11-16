# LoL Galaxy

Source for lolgalaxy.com, served by GitHub Pages.

- `index.html`: homepage
- `lanelock/index.html`: the LaneLock game (everything in one file)
- `leagueSim/index.html`: redirect from the game's old name and address
- `privacy.html`: privacy policy 
- `ads.txt`: fill in your AdSense publisher line after approval
- `404.html`: sends /LaneLock, /leaguesim and other case variants to /lanelock/

## Turning on ads

1. Get the site approved in AdSense.
2. In `lanelock/index.html`, fill in `adsenseClient` and the three `adSlots` IDs in the `CONFIG` block at the top of the script.
3. Put your publisher line in `ads.txt`.

## Updating matchup data

Lane matchup win rates come from LoLalytics (patch 26.22, Emerald+). They're stored in `MATCHUP_DATA` inside `lanelock/index.html`. Tiers are in `TIERS`.

LoL Galaxy was created under Riot Games' "Legal Jibber Jabber" policy using assets owned by Riot Games. Riot Games does not endorse or sponsor this project.
