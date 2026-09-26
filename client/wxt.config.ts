import { defineConfig } from 'wxt';

// See https://wxt.dev/api/config.html
export default defineConfig({
    manifestVersion: 3,
    manifest: {
        permissions: [
            "storage",
            "tabs"
        ],
        browser_specific_settings: {
            gecko: {
                id: "{057c1530-0caf-4f22-8d70-f651697364e9}"
            }
        },
        action: {}
    }
});
