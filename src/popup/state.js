export async function getState() {
    return browser.runtime.sendMessage({ type: "get-state" }).then(({ response }) => {
        return response
    })
}

export async function setState(state) {
    return browser.runtime.sendMessage({ type: "set-state", state })
}
