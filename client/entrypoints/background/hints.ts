import { apClient } from ".";
import { getGameState } from "./state";

export async function retrieveHint() {
    const locationToHint = await getUndiscoveredLocation()

    if(locationToHint !== undefined) {
        const hintedItem = (await apClient.scout([locationToHint], 1))[0]

        if(!hintedItem) {
            console.log(`No item at the scouted location : ${locationToHint}`)
            return
        }

    } else {
        console.log("Hint received but all remaining locations are hinted !")
    }
}

async function getUndiscoveredLocation() {
    let gameState = await getGameState()
    let remainingLocations = apClient.room.missingLocations
    remainingLocations = remainingLocations.filter(element => !gameState.hintedLocations.includes(element));

    // Case where there are no more locations to hint
    if (remainingLocations.length == 0) {
        return
    }

    let allItems = await apClient.scout(remainingLocations, 0)
    let usefulItemLoc = -1
    // Look for a progression item

    while(remainingLocations.length > 0) {
        const randomIndex = Math.floor(Math.random() * remainingLocations.length);

        const pickedLocation = remainingLocations.splice(randomIndex, 1)[0]!;
        const pickedItem = allItems.splice(randomIndex, 1)[0]!;

        if(pickedItem.progression) {
            return pickedLocation
        } else if (pickedItem.useful) {
            usefulItemLoc = pickedLocation
        }
    }

    // No progression but at least one useful
    if (usefulItemLoc !== -1) {
        return usefulItemLoc
    }

    // No progression or useful : return filler
    return remainingLocations[Math.floor(Math.random() * remainingLocations.length)] as number
}