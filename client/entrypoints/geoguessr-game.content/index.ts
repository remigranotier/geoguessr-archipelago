import { RoundFinishedMessage, type GeoguessrRoundFinishedMessage } from "../common/messages";
import { GACGameType, type GACResponse } from "../common/models";

export default defineContentScript({
    matches: ['*://*.geoguessr.com/game/*'],
    main() {
        console.log('Hello from geoguessr-game')

        // Listen to Geoguessr games finished
        window.addEventListener('message', handleGeoguessrGameFinishedMessage);
    }
});

async function handleGeoguessrGameFinishedMessage(event: MessageEvent<GeoguessrRoundFinishedMessage>) {
    if (
        event.source === window
    ) {
        console.debug('GEOGUESSR-GAME - API response:', event.data);
        const roundFinishedMessage = new RoundFinishedMessage(
            event.data.state!,
            event.data.token!,
            GACGameType.Game,
            event.data.mapId!,
            event.data.mapName!,
            event.data.roundScore!,
            event.data.totalScore!
        )
        const roundFinishedResponse: GACResponse = await browser.runtime.sendMessage(roundFinishedMessage)
        console.debug("RoundFinishedMessage correctly sent")
        if (!roundFinishedResponse.success) {
            console.error("Error while sending RoundFinishedMessage:", roundFinishedResponse.error)
        }
    }
}