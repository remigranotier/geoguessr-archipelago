import { Client } from "archipelago.js";
import type { GACMessage, GACResponse, SlotData } from "../common/models";

const client = new Client();

function messageListener(message: GACMessage, sender: Browser.runtime.MessageSender, sendResponse: (response: GACResponse) => void) {
  console.log(message)
}

export default defineBackground(async () => {
  browser.runtime.onMessage.addListener(messageListener)

  const serverUrl = "archipelago.gg:63119"
  const slotName = "LeRemiii";

  client.messages.on("message", (content) => {
    console.log(content);
  });

  const slotData = await client.login(serverUrl, slotName, "Slay the Spire II")

  console.log(slotData)
});
