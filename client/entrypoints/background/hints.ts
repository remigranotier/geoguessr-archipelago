import { apClient } from ".";

export async function retrieveHint() {
    const locationToHint = getUndiscoveredLocation()
    await apClient.scout([locationToHint], 1)
}

function getUndiscoveredLocation() {
    return 1
}