const history = []
let index = -1

function loadPhrases() {
    const url = browser.extension.getURL("phrases.txt")
    return fetch(url).then(res => res.text())
}

function randomIndex(rand, length) {
    return Math.floor(rand * length)
}

loadPhrases().then(text => {
    text = text.split("\n")
    history.push(randomIndex(Math.random(), text.length))
    index = 0

    browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
        const { type, rand } = request

        if (type === "prev") {
            index = Math.max(index - 1, 0)
        } else if (type === "next") {
            if (rand) {
                history.push(randomIndex(rand, text.length))
                index++
            }
        }

        sendResponse({ response: text[history[index]] })
    })
})
