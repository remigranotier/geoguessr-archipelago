import { apClient, hintedLocations } from ".";

export async function retrieveHint() {
    const locationToHint = getUndiscoveredLocation()
    if(locationToHint !== undefined) {
        await apClient.scout([locationToHint], 1)
    } else {
        console.log("Hint received but all remaining locations are hinted !")
    }
}

function getUndiscoveredLocation() {
    let remainingLocations = apClient.room.missingLocations
    remainingLocations = remainingLocations.filter(element => !hintedLocations.includes(element));

    // Case where there are no more locations to hint
    if (remainingLocations.length == 0) {
        return
    }

    const pickedLocation = remainingLocations[Math.floor(Math.random() * remainingLocations.length)] as number;
    hintedLocations.push(pickedLocation)
    return pickedLocation
}