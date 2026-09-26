export function setNotConnected() {
    document.querySelector("#status")!.textContent = "Not connected"
}

export function setConnected() {
    document.querySelector("#status")!.textContent = "Connected"
}

export function setConnectionFailed() {
    document.querySelector("#status")!.textContent = "Connection failed"
}

export function setConnectionInProgress() {
    document.querySelector("#status")!.textContent = "Connecting..."
}