export function resolveI18n() {
    document.querySelectorAll<HTMLElement>("[data-i18n]").forEach((element) => {
        const key = element.dataset.i18n as "@@extension_id";
        if (key) {
            element.textContent = browser.i18n.getMessage(key);
        }
    });
    document.querySelectorAll("*").forEach((el) => {
        for (const attr of el.attributes) {
            if (!attr.name.startsWith("data-i18n-")) {
                continue;
            }

            const target = attr.name.substring("data-i18n-".length);
            const message = browser.i18n.getMessage(attr.value as "@@extension_id");

            if (message) {
                el.setAttribute(target, message);
            }
        }
    });
}