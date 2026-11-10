import { apClient, hintedLocations } from ".";

export async function retrieveHint() {
    const locationToHint = await getUndiscoveredLocation()
    if(locationToHint !== undefined) {
        await apClient.scout([locationToHint], 1)
    } else {
        console.log("Hint received but all remaining locations are hinted !")
    }
}

async function getUndiscoveredLocation() {
    let remainingLocations = apClient.room.missingLocations
    remainingLocations = remainingLocations.filter(element => !hintedLocations.includes(element));

    // Case where there are no more locations to hint
    if (remainingLocations.length == 0) {
        return
    }

    // Look for a progression item
    let locationsIterProgression = [...remainingLocations];

    while(locationsIterProgression.length > 0) {
        let pickedLocation = remainingLocations[Math.floor(Math.random() * remainingLocations.length)] as number
        let item = (await apClient.scout([pickedLocation], 0))[0]

        if(item?.progression) {
            hintedLocations.push(pickedLocation)
            return pickedLocation
        }
    }

    // No progression : look for usefuls
    let locationsIterUseful = [...remainingLocations];

    while(locationsIterUseful.length > 0) {
        let pickedLocation = remainingLocations[Math.floor(Math.random() * remainingLocations.length)] as number
        let item = (await apClient.scout([pickedLocation], 0))[0]

        if(item?.useful) {
            hintedLocations.push(pickedLocation)
            return pickedLocation
        }
    }

    // No progression or useful : return filler
    return remainingLocations[Math.floor(Math.random() * remainingLocations.length)] as number
}