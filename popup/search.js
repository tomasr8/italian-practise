function sendMesage(msg) {
    return browser.runtime.sendMessage(msg).then(({ response }) => {
        return response
    })
}

function searchText(text, sourceLang, tartgetLang) {
    return sendMesage({ type: "search-initial", text, sourceLang, tartgetLang })
}

function prevPage() {
    return sendMesage({ type: "search-prev" })
}

function nextPage() {
    return sendMesage({ type: "search-next" })
}

function createPhraseElement([source, target]) {
    const html = `
        <div class="marginBottom">
            <div class="row">
                <div class="column phraseContainer searchPadding verticalAlign">
                    ${source}
                </div>
            </div>
            <div class="row">
                <div class="column column-95 column-offset-5 searchPaddingRight verticalAlign">
                    <span>${target}</span>
                </div>
            </div>
        </div>
    `
    const parser = new DOMParser()
    return parser.parseFromString(html, "text/html").body.childNodes[0]
}

function isVisible() {
    return !document.getElementById("search-content").classList.contains("hidden")
}

document.addEventListener("DOMContentLoaded", () => {
    const textInput = document.getElementById("search-text")
    const source = document.getElementById("sourceLang")
    const target = document.getElementById("targetLang")
    const searchBtn = document.getElementById("search")
    const resultDiv = document.getElementById("search-result")

    function onSearch({ page, hasPrev, hasNext }) {
        resultDiv.replaceChildren()

        for (const pair of page) {
            const elem = createPhraseElement(pair)
            resultDiv.appendChild(elem)
        }

        if (page.length > 0) {
            document.getElementById("search-navigation").classList.remove("hidden")
        } else {
            document.getElementById("search-navigation").classList.add("hidden")
        }
        document.getElementById("search-prev").disabled = !hasPrev
        document.getElementById("search-next").disabled = !hasNext
    }

    searchBtn.addEventListener("click", () => searchText(textInput.value, source.value, target.value).then(onSearch))
    document.getElementById("search-prev").addEventListener("click", () => prevPage().then(onSearch))
    document.getElementById("search-next").addEventListener("click", () => nextPage().then(onSearch))

    document.addEventListener("keydown", event => {
        if (event.key === "ArrowLeft" && isVisible()) {
            prevPage().then(onSearch)
        } else if (event.key === "ArrowRight" && isVisible()) {
            nextPage().then(onSearch)
        }
    })
})
