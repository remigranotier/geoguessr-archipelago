import type { MessageNode } from "archipelago.js";
import { apClient } from ".";
import { parseHTML } from "linkedom";

export function handleRetrieveLogsMessage(): string[] {
    return apClient.messages.log.map((log) => renderNodes(log.nodes))
}

export function renderNodes(nodes: MessageNode[]): string {
    return nodes.map((node) => renderNode(node)).join("")
}

export function renderNode(node: MessageNode): string {
    const { window } = parseHTML(`
        <html>
            <body></body>
        </html>
    `);

    const { document } = window;

    const nodeElement = document.createElement("span")
    console.debug(node)
    switch (node.type) {
        case "player":
            nodeElement.style.color = "#EE00EE"
            nodeElement.textContent = node.player.name
            break;
        case "location":
            nodeElement.style.color = "#00FF7F"
            nodeElement.textContent = node.text
            break;
        case "item":
            if (node.item.progression) {
                nodeElement.style.color = "#AF99EF"
            } else if (node.item.useful) {
                nodeElement.style.color = "#6D8BE8"
            } else if (node.item.trap) {
                nodeElement.style.color = "#FA8072"
            } else {
                nodeElement.style.color = "#00EEEE"

            }
            nodeElement.textContent = node.item.name
            break;
        case "color":
            nodeElement.style.color = node.color
            nodeElement.textContent = node.toString()
            break;
        case "entrance":
            nodeElement.style.color = "#6495ED"
            nodeElement.textContent = node.text
            break;
        case "text":
            nodeElement.style.color = "white"
            nodeElement.textContent = node.text
            break;
    }
    return nodeElement.outerHTML
}