import { defineConfig } from 'wxt';

// See https://wxt.dev/api/config.html
export default defineConfig({
    manifestVersion: 3,
    manifest: {
        permissions: [
            "storage",
            "tabs",
            "notifications",
            "unlimitedStorage"
        ],
        browser_specific_settings: {
            gecko: {
                id: "{057c1530-0caf-4f22-8d70-f651697364e9}"
            }
        },
        action: {},
        default_locale: "en",
        name: "__MSG_extName__",
        description: "__MSG_extDescription__",
        web_accessible_resources: [
            { matches: ["*://*.geoguessr.com/game/*"], resources: ["/icon/128.png"] }
        ]
    }
});
