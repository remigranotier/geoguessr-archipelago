export function setupDeathLink() {
    console.debug("Setting up death link")
    storage.watch<boolean>("local:death-link", (newValue, _oldValue) => {
        console.debug("New value for death link:", newValue)
        if (newValue) {
            void performDeathLink()
        }
        void storage.removeItem("local:death-link")
    })
}

async function performDeathLink() {
    console.debug("Triggering death link")

    const url = location.href
    const urlSplit = url.split("/")
    const gameId = urlSplit?.at(-1)

    const response = await fetch(
        `https://www.geoguessr.com/api/v3/games/${gameId}`,
        {
            method: "POST",
            body: JSON.stringify({
                lat: -80,
                lng: 0,
                stepsCount: 0,
                timedOut: true,
                token: gameId,
            }),
            headers: {
                "Content-Type": "application/json"
            }
        }
    )

    if (response.ok) {
        window.location.reload()
    } else {
        console.error("Error while guessing with death link:", response.status, response.statusText)
    }
}