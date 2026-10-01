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

Additional checks:
- First 5k

### Unlocks

You start with only the World map in No Move, No Pan, No Zoom.

When an unlock is triggered, different things can improve your possibilities of doing unlocks
- Unlock a new map
- Unlock a new movement for a map (Move/Pan/Zoom)

Additional unlock ideas: #TODO
- External scripts disabled : Blink mode, No Car, No Compass

### Filler items

Malus: #TODO
- Return to spawn
- Blind
- Beyblade
- No zoom on map for N seconds
- Can't move for N seconds

Bonus: #TODO
- Random tip on the latest map played

### How to finish

- N countries with platinum medal, configured on generation