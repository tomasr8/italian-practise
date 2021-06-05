const IT = "it"
const EN = "en"

function sendMesage(msg) {
    return browser.runtime.sendMessage(msg).then(({ response }) => {
        return response
    })
}

function searchText(text, language) {
    return sendMesage({ type: "search-initial", text, language })
}

function prevPage() {
    return sendMesage({ type: "search-prev" })
}

function nextPage() {
    return sendMesage({ type: "search-next" })
}

function createPhraseElement(pair) {
    const html = `
        <div class="marginBottom">
            <div class="row">
                <div class="column phraseContainer searchPadding verticalAlign">
                    ${pair[0]}
                </div>
            </div>
            <div class="row">
                <div class="column column-95 column-offset-5 searchPaddingRight verticalAlign">
                    <span>${pair[1]}</span>
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
    const itBtn = document.getElementById("search-it")
    const enBtn = document.getElementById("search-en")
    const resultDiv = document.getElementById("search-result")

    function onSearch({ page, hasPrev, hasNext, language }) {
        while (resultDiv.firstChild) {
            resultDiv.firstChild.remove()
        }

        for (let pair of page) {
            if (language === IT) {
                pair = [pair[1], pair[0]]
            }
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

    document.getElementById("search-prev").addEventListener("click", () => prevPage().then(onSearch))
    document.getElementById("search-next").addEventListener("click", () => nextPage().then(onSearch))

    itBtn.addEventListener("click", () => searchText(textInput.value, IT).then(onSearch))
    enBtn.addEventListener("click", () => searchText(textInput.value, EN).then(onSearch))

    document.addEventListener("keydown", event => {
        if (event.key === "ArrowLeft" && isVisible()) {
            prevPage().then(onSearch)
        } else if (event.key === "ArrowRight" && isVisible()) {
            nextPage().then(onSearch)
        }
    })
})
