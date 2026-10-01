import { RoundFinishedMessage, type GeoguessrRoundFinishedMessage } from "../common/messages";
import { type GACResponse } from "../common/models";

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
            event.data.mapId!,
            event.data.mapName!,
            event.data.roundScore!,
            event.data.totalScore!
        )
        const _roundFinishedResponse: GACResponse = await browser.runtime.sendMessage(roundFinishedMessage)
        console.debug("RoundFinishedMessage correctly sent")
    }
}