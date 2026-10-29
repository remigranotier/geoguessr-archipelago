import { getMedalText } from "../client-tab/ui/maps";
import { GACMedal } from "../common/config/medals";
import { RetrieveConnectionStatusMessage, RoundFinishedMessage, type GeoguessrRoundFinishedMessage } from "../common/messages";
import { GACGameState, GACGameType, GACMap, type GACResponse } from "../common/models";
import './style.css'

const THRESHOLD_DIV_ID = "geoguessr-archipelago-threshold"
export const DEFAULT_CONNECTION_STATUS = { authenticated: false, player: "", server: "", seed: "" }
let gamestate = new GACGameState()
let connectionStatus = DEFAULT_CONNECTION_STATUS

export default defineContentScript({
    matches: ['*://*.geoguessr.com/game/*'],
    main() {
        window.addEventListener('message', handleGeoguessrGameFinishedMessage);

        const appearanceObserver = new MutationObserver((_mutationsList, observer) => {
            const roundStatusPanel = document.querySelector("[class^=rounds-status_panel__]");
            console.debug("Checking for round status panel appearance")
            if (roundStatusPanel !== null) {
                console.debug("Appearance OK");
                void displayThresholds(roundStatusPanel);
                observer.disconnect();
                disappearanceObserver.observe(roundStatusPanel.parentElement!, { childList: true });
            }
        });

        const disappearanceObserver = new MutationObserver((_mutationsList, observer) => {
            const roundStatusPanel = document.querySelector("[class^=rounds-status_panel__]");
            console.debug("Checking for round status panel disappearance")
            if (roundStatusPanel === null) {
                console.debug("Disppearance OK");
                observer.disconnect();
                const inGameLayout = document.querySelector("[class^=in-game_layout__]")!;
                appearanceObserver.observe(inGameLayout, { childList: true });
            }
        });


        appearanceObserver.observe(document.body, { subtree: true, childList: true });
    }
});

async function handleGeoguessrGameFinishedMessage(event: MessageEvent<GeoguessrRoundFinishedMessage>) {
    if (
        event.source === window && event.origin === "https://www.geoguessr.com" && event.data.mapId !== undefined
    ) {
        console.debug('GEOGUESSR-GAME - API response:', event.data);
        const roundFinishedMessage = new RoundFinishedMessage(
            event.data.state!,
            event.data.token!,
            GACGameType.Game,
            event.data.gamemode!,
            event.data.mapId!,
            event.data.mapName!,
            event.data.roundScore!,
            event.data.roundCount!,
            event.data.totalScore!,
        )
        const roundFinishedResponse: GACResponse = await browser.runtime.sendMessage(roundFinishedMessage)
        console.debug("RoundFinishedMessage correctly sent")
        if (!roundFinishedResponse.success) {
            console.error("Error while sending RoundFinishedMessage:", roundFinishedResponse.error)
        }
    }
}

async function displayThresholds(roundStatusPanel: Element) {
    let thresholdDiv = getOrCreateThresholdDiv(roundStatusPanel)

    const getConnectionStatusResponse: GACResponse = await browser.runtime.sendMessage(new RetrieveConnectionStatusMessage())
    if (!getConnectionStatusResponse.success) {
        console.error("Failed to send message to extension from content script")
        thresholdDiv.replaceChildren()
        return
    }
    connectionStatus = getConnectionStatusResponse.data
    if (!getConnectionStatusResponse.data.authenticated) {
        console.log("No game in progress")
        thresholdDiv.replaceChildren()
        return
    }

    storage.unwatch()
    storage.watch<GACGameState>(`local:${connectionStatus.seed}-${connectionStatus.player}`, (newGameState, _oldGameState) => {
        gamestate = newGameState ?? new GACGameState()
        renderThresholdDivText(roundStatusPanel)
    })

    gamestate = await storage.getItem(`local:${connectionStatus.seed}-${connectionStatus.player}`) ?? new GACGameState()
    renderThresholdDivText(roundStatusPanel)
}

function getOrCreateThresholdDiv(roundStatusPanel: Element) {
    let thresholdDiv = roundStatusPanel.querySelector<HTMLDivElement>(`#${THRESHOLD_DIV_ID}`)
    if (thresholdDiv === null) {
        thresholdDiv = document.createElement("div")
        thresholdDiv.id = THRESHOLD_DIV_ID
        roundStatusPanel.appendChild(thresholdDiv)
    }
    return thresholdDiv
}

function getOrCreateThresholdDivText(thresholdDiv: HTMLDivElement) {
    let thresholdTextDiv = thresholdDiv.querySelector(`${THRESHOLD_DIV_ID}-text`)
    if (thresholdTextDiv === null) {
        thresholdTextDiv = document.createElement("div")
        thresholdTextDiv.id = `${THRESHOLD_DIV_ID}-text`
        thresholdDiv.replaceChildren()
        let thresholdLogoDiv = document.createElement("img")
        thresholdLogoDiv.id = `${THRESHOLD_DIV_ID}-logo`
        thresholdLogoDiv.src = browser.runtime.getURL('/icon/128.png')
        thresholdDiv.appendChild(thresholdLogoDiv)
        thresholdDiv.appendChild(thresholdTextDiv)
    }
    return thresholdTextDiv
}

function renderThresholdDivText(roundStatusPanel: Element) {
    const thresholdDiv = getOrCreateThresholdDiv(roundStatusPanel)
    const mapName = roundStatusPanel.querySelector("[class^=rounds-status_mapTitleText__]")?.textContent

    if (mapName === undefined) {
        console.warn("Could not find map name in page")
        thresholdDiv.replaceChildren()
        return
    }

    const map = gamestate.maps.find((m) => m.areaMap.mapName == mapName)

    if (map === undefined) {
        console.warn("Could not find current map in game state")
        console.debug(gamestate)
        console.debug(mapName)
        thresholdDiv.replaceChildren()
        return
    }

    const nextMedal = getNextMedal(map)
    const medalText = getMedalText(nextMedal) + " " + getScoreText(map, nextMedal)

    let thresholdTextDiv = getOrCreateThresholdDivText(thresholdDiv)

    thresholdTextDiv.textContent = `Next medal: ${medalText}`
}

function getNextMedal(map: GACMap) {
    const score = map.progression.bestScore
    switch (true) {
        case score < map.areaMap.medalThresholds[GACMedal.Bronze]:
            return GACMedal.Bronze
        case score < map.areaMap.medalThresholds[GACMedal.Silver]:
            return GACMedal.Silver
        case score < map.areaMap.medalThresholds[GACMedal.Gold]:
            return GACMedal.Gold
        case gamestate.configData.include_platinums && score < map.areaMap.medalThresholds[GACMedal.Platinum]:
            return GACMedal.Platinum
        default:
            return GACMedal.None
    }
}

function getScoreText(map: GACMap, medal: GACMedal) {
    if (medal == GACMedal.None) {
        return "No more medals to collect"
    }
    return map.areaMap.medalThresholds[medal].toString()
}