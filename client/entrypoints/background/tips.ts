import { SendNewLogMessage } from "../common/messages"

const QUESTIONABLE_TIPS: string[] = [
    '"Vende" is a Brazilian town in the state of Sergipe. It is known for having fans all over the country.',
    '"Sehir Merkezi" is a Turkish football player that played a long time for Galatasaray.',
    '"Selamat Datang" is a neighboorhood in East Jakarta that loves displaying their town signs.',
]

const SPECIAL_TIPS: string[] = [
    "The area code for San Luis Potosi city in Mexico is (444).",
    "Brick houses in France are mainly found in the very northern part of the country.",
    "A big part of Ukraine is covered using a red car with a long antenna.",
    "The northern third of Chile is covered by the Atacama desert, the driest place on Earth.",
]

export function getRandomQuestionableTip(): string {
    return QUESTIONABLE_TIPS[Math.floor(Math.random() * QUESTIONABLE_TIPS.length)]!
}

export function getRandomSpecialTip(): string {
    return SPECIAL_TIPS[Math.floor(Math.random() * SPECIAL_TIPS.length)]!
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

export function sendNotification(title: string, message: string) {
    console.debug(Notification.permission)
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