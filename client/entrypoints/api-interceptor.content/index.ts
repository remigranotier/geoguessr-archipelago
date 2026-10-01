import { GeoguessrRoundFinishedMessage } from "../common/messages";

export default defineContentScript({
    matches: ['*://*.geoguessr.com/game/*'],
    world: 'MAIN',
    runAt: 'document_start',
    main() {
        const originalFetch = window.fetch;

        window.fetch = async (...args) => {
            const [input, init] = args;

            const maybeRequestInput = input instanceof Request
                ? input.url
                : String(input);
            const url =
                typeof input === 'string'
                    ? input
                    : maybeRequestInput;

            const method =
                init?.method ??
                (input instanceof Request ? input.method : 'GET');

            const response = await originalFetch(...args);

            if (
                method.toUpperCase() === 'POST' &&
                url.includes('/api/v3/games/')
            ) {
                try {
                    const data = await response.clone().json();
                    const message = new GeoguessrRoundFinishedMessage(data)
                    console.debug("Sending message to geoguessr-game:", message)

                    window.postMessage(
                        message,
                        '*',
                    );

                } catch (e) {
                    console.error("Error while fetching game information:", e)
                }
            }

            return response;
        };
    }
});