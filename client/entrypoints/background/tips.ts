import { SendNewLogMessage } from "../common/messages"
import { QUESTIONABLE_TIPS_EN, QUESTIONABLE_TIPS_FR, SPECIAL_TIPS_EN, SPECIAL_TIPS_FR } from "../common/config/tips-list"

function getRandomQuestionableTip(): string {
    const lang = browser.i18n.getUILanguage();
    if(lang.includes("fr")) {
        return QUESTIONABLE_TIPS_FR[Math.floor(Math.random() * QUESTIONABLE_TIPS_FR.length)]!
    } else {
        return QUESTIONABLE_TIPS_EN[Math.floor(Math.random() * QUESTIONABLE_TIPS_EN.length)]!
    }
}

function getRandomSpecialTip(): string {
    const lang = browser.i18n.getUILanguage();
    if(lang.includes("fr")) {
        return SPECIAL_TIPS_FR[Math.floor(Math.random() * SPECIAL_TIPS_FR.length)]!
    } else {
        return SPECIAL_TIPS_EN[Math.floor(Math.random() * SPECIAL_TIPS_EN.length)]!
    }
}

export function sendSpecialTip() {
    const specialTip = getRandomSpecialTip()
    sendNotification("A special tip!", specialTip)
    void browser.runtime.sendMessage(new SendNewLogMessage(`<span style="color:yellow">New special tip received</span>: <span style="color:white">${specialTip}</span>`))
}

export function sendQuestionableTip() {
    const questionableTip = getRandomQuestionableTip()
    sendNotification("Questionable tip?", questionableTip)
    void browser.runtime.sendMessage(new SendNewLogMessage(`<span style="color:red">New questionable tip received</span>: <span style="color:white">${questionableTip}</span>`))
}

function sendNotification(title: string, message: string) {
    if (browser.notifications == undefined) {
        console.warn("This browser does not support desktop notifications")
    } else if (Notification.permission == "granted") {
        console.debug("Notifications are allowed by browser, sending.")
        try {
            new Notification(title, { body: message, icon: browser.runtime.getURL("/icon/128.png"), silent: true })
        } catch (error) {
            void browser.notifications.create("geoguessr-tip", {
                title: title,
                message: message,
                iconUrl: browser.runtime.getURL("/icon/128.png"),
                type: "basic",
                silent: true,
            })
        }

    } else {
        console.debug("Notifications are not allowed by browser, ignoring.")
    }
}