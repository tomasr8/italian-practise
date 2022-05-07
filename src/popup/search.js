import { getState } from "./state"

function sendMesage(msg) {
    return browser.runtime.sendMessage(msg).then(({ response }) => {
        return response
    })
}

function searchCorpus(sourceLang, targetLang, q) {
    return sendMesage({ type: "search-init", sourceLang, targetLang, q })
}

function prevPage() {
    return sendMesage({ type: "search-prev" })
}

function nextPage() {
    return sendMesage({ type: "search-next" })
}

function createPhraseElement({ original, translated }, q) {
    original = original.replace(new RegExp(q, "ig"), replace => `<strong>${replace}</strong>`)

    const html = `
        <div class="phrase">
            <div class="original">
                <span>${original}</span>
            </div>
            <div class="translated">
                <span>${translated}</span>
            </div>
        </div>
    `
    const parser = new DOMParser()
    return parser.parseFromString(html, "text/html").body.childNodes[0]
}

function isDisabled(elem) {
    return document.getElementById(elem).disabled
}

document.addEventListener("DOMContentLoaded", async () => {
    const textInput = document.getElementById("search-text")
    const source = document.getElementById("search-source-lang")
    const target = document.getElementById("search-target-lang")
    const searchBtn = document.getElementById("search-corpus")
    const resultDiv = document.getElementById("search-result")

    function onSearch({ page, hasPrev, hasNext }) {
        console.log("PAGE", page, hasPrev, hasNext)
        resultDiv.replaceChildren()

        if (Array.isArray(page)) {
            for (const pair of page) {
                const elem = createPhraseElement(pair, textInput.value)
                resultDiv.appendChild(elem)
            }
        }

        const action = page && page.length > 0 ? "remove" : "add"
        document.getElementById("search-navigation").classList[action]("hidden")
        document.getElementById("search-prev").disabled = !hasPrev
        document.getElementById("search-next").disabled = !hasNext
    }

    textInput.addEventListener("keydown", event => {
        if (["ArrowLeft", "ArrowRight"].includes(event.key)) {
            event.stopPropagation()
        }
    })

    searchBtn.addEventListener("click", () => {
        console.log("CLICK", source.value, target.value, textInput.value)
        searchCorpus(source.value, target.value, textInput.value).then(onSearch)
    })

    document.getElementById("search-prev").addEventListener("click", () => {
        prevPage().then(onSearch)
    })
    document.getElementById("search-next").addEventListener("click", () => {
        nextPage().then(onSearch)
    })

    document.addEventListener("keydown", event => {
        if (event.key === "ArrowLeft" && !isDisabled("search-prev")) {
            prevPage().then(onSearch)
        } else if (event.key === "ArrowRight" && !isDisabled("search-next")) {
            nextPage().then(onSearch)
        } else if (event.key === "Enter") {
            searchCorpus(source.value, target.value, textInput.value).then(onSearch)
        }
    })

    const { search } = await getState()
    textInput.value = search.q
    source.value = search.sourceLang
    target.value = search.targetLang
    onSearch(search.result)
})
