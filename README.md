# Geoguessr Archipelago Client

## Requirements

To play this, you need access to a Geoguessr Pro subscription (to generate solo games).

Eventually, we plan to add the possibility to submit challenges manually and to retrieve scores of a free account on them to allow playing if you're not the one generating the game.

## Design

### Interfacing with the game

The client is an extension handling the connection to the AP server using archipelago.js. 
It is built and developed using WXT.

### Checks

Checks are detected by the content script. They correspond to attaining a point threshold (configured in options) in a game of a particular map. 
Different point thresholds might exist for the same map :
- Bronze (default: 7500 pts)
- Silver (default: 15000 pts)
- Gold (default: 22500 pts)
- Platinum (default: 25000 pts)

Each tier for each map is a check, and multiple checks might get triggered by the same map (for example, a 25000 score can check all the thresholds at once).

Additional check ideas:
- First 5k
- A manual check on some species of animals/trees found on streetview

### Unlocks

You start with only 10 seconds and No Move, No Pan, No Zoom for every map.

When an unlock is triggered, different things can improve your possibilities of doing unlocks
- Unlock a new map
- Unlock a new movement (Move/Pan/Zoom). This can be per-map, configurable in the options.
- Unlock more time (Progressive time) -> 10s, 20s, 30s, 40s, 50s, 1min, 1min30, 2min, 2min30, 3min, 4min, 5min, 10min, No Time

Additional unlock ideas:
- Unlock the ability to zoom on map
- Unlock more movements (Progressive move): 3 clicks, 10 clicks, 50 clicks, unlimited
- External scripts disabled : Blink mode, No Car, No Compass

### How to finish

- N countries with platinum
- N medals