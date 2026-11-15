import { apClient } from ".";
import { SendNewLogMessage } from "../common/messages";
import { GACHint, type GACGameState } from "../common/models";

export async function retrieveNewHint() {
    console.debug("Retrieving new hint")
    const locationToHint = await getUndiscoveredLocation()
    console.debug("Location to hint:", locationToHint)

    if (locationToHint !== undefined) {
        await apClient.scout([locationToHint], 1).then((items) => {
            if (items.length == 0) {
                console.log(`No item at the scouted location : ${locationToHint}`)
            }
        })

        console.debug("Waiting for hintReceived...")
        await apClient.items.wait("hintReceived")
        console.debug("hintReceived message received")
    } else {
        void browser.runtime.sendMessage(new SendNewLogMessage("Hint received but all remaining locations are hinted !"))
    }
}

async function getUndiscoveredLocation() {
    let remainingLocations = apClient.room.missingLocations
    const hintedLocations = new Set(apClient.items.hints.map((hint) => hint.item.locationId))
    remainingLocations = remainingLocations.filter(element => !hintedLocations.has(element));

    // Case where there are no more locations to hint
    if (remainingLocations.length == 0) {
        return
    }

    let allItems = await apClient.scout(remainingLocations, 0)
    let usefulItemLoc

    // Look for a progression item
    while (remainingLocations.length > 0) {
        const randomIndex = Math.floor(Math.random() * remainingLocations.length);

        const pickedLocation = remainingLocations.splice(randomIndex, 1)[0]!;
        const pickedItem = allItems.splice(randomIndex, 1)[0]!;

        if (pickedItem.progression) {
            return pickedLocation
        } else if (pickedItem.useful) {
            usefulItemLoc = pickedLocation
        }
    }

    // No progression but at least one useful
    if (usefulItemLoc !== undefined) {
        return usefulItemLoc
    }

    // No progression or useful : return filler
    return remainingLocations[Math.floor(Math.random() * remainingLocations.length)] as number
}

export function updateHints(gameState: GACGameState) {
    if (apClient.items.hints.length < gameState.hints.length) {
        console.warn("Fewer hints on server than on save. Ignoring")
        return
    }

    gameState.hints = apClient.items.hints.map((hint) => new GACHint(
        hint.item.locationName,
        hint.item.locationId,
        hint.item.name,
        hint.item.id,
        hint.item.sender.alias,
        hint.item.receiver.alias,
        hint.found
    ))
}