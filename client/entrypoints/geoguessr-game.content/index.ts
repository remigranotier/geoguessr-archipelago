import { GameFinishedMessage, GeoguessrGameStatus, MessageType, type GeoguessrGameFinishedMessage } from "../common/models";

export default defineContentScript({
    matches: ['*://*.geoguessr.com/game/*'],
    main() {
        console.log('Hello from geoguessr-game')

        // Listen to Geoguessr games finished
        window.addEventListener('message', handleGeoguessrGameFinishedMessage);
    }
});

async function handleGeoguessrGameFinishedMessage(event: MessageEvent<GeoguessrGameFinishedMessage>) {
    if (
        event.source === window
    ) {
        console.debug('GEOGUESSR-GAME - API response:', event.data);
        if (event.data.state == GeoguessrGameStatus.FINISHED) {
            const gameFinishedMessage = new GameFinishedMessage(event.data.token!, event.data.mapId!, event.data.mapName!, event.data.totalScore!)
            const gameFinishedResponse = await browser.runtime.sendMessage(gameFinishedMessage)
            console.debug("GameFinishedMessage correctly sent")
        }
    }
}