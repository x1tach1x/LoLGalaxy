# LaneLock

Source for lanelock.net, served by GitHub Pages. (lolgalaxy.com, the old domain, forwards here.)

- `index.html`: homepage
- `play/index.html`: the LaneLock game (everything in one file)
- `lanelock/index.html`, `leagueSim/index.html`: redirects from the game's old addresses
- `privacy.html`: privacy policy 
- `ads.txt`: fill in your AdSense publisher line after approval
- `404.html`: sends /Play, /lanelock, /leaguesim and other case variants to /play/

## Turning on ads

1. Get the site approved in AdSense.
2. In `play/index.html`, fill in `adsenseClient` and the three `adSlots` IDs in the `CONFIG` block at the top of the script.
3. Put your publisher line in `ads.txt`.

## Updating matchup data

Lane matchup win rates come from LoLalytics (patch 26.22, Emerald+). They're stored in `MATCHUP_DATA` inside `play/index.html`. Tiers are in `TIERS`.

LaneLock was created under Riot Games' "Legal Jibber Jabber" policy using assets owned by Riot Games. Riot Games does not endorse or sponsor this project.
