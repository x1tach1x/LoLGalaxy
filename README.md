# LoL Galaxy

Source for lolgalaxy.com, served by GitHub Pages.

- `index.html`: homepage
- `leagueSim/index.html`: the LeagueSim game (everything in one file)
- `privacy.html`: privacy policy (add a contact before applying for AdSense)
- `ads.txt`: fill in your AdSense publisher line after approval
- `404.html`: sends lowercase links like /leaguesim to /leagueSim/

## Turning on ads

1. Get the site approved in AdSense.
2. In `leagueSim/index.html`, fill in `adsenseClient` and the three `adSlots` IDs in the `CONFIG` block at the top of the script.
3. Put your publisher line in `ads.txt`.

## Updating matchup data

Lane matchup win rates come from LoLalytics (patch 26.22, Emerald+). They're stored in `MATCHUP_DATA` inside `leagueSim/index.html`. Tiers are in `TIERS`.

LoL Galaxy was created under Riot Games' "Legal Jibber Jabber" policy using assets owned by Riot Games. Riot Games does not endorse or sponsor this project.
