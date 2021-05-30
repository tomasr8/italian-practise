function searchText(text, language = "it", startIndex = 0) {
    return browser.runtime.sendMessage({ type: "search", text, language, startIndex }).then(({ response }) => {
        return response
    })
}

function nextPage() {
    return browser.runtime.sendMessage({ type: "next-page" }).then(({ response }) => {
        return response
    })
}

function prevPage() {
    return browser.runtime.sendMessage({ type: "prev-page" }).then(({ response }) => {
        return response
    })
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

// function createNavigationElement() {
//     const html = `
//         <div class="row">
//             <div class="column">
//                 <button id="prev-search">Prev</button>
//             </div>
//             <div class="column">
//                 <button id="next-search">Next</button>
//             </div>
//         </div>
//     `
//     const parser = new DOMParser();
//     return parser.parseFromString(html, 'text/html').body.childNodes[0];
// }

document.addEventListener("DOMContentLoaded", () => {
    const textInput = document.getElementById("search-text")
    const itBtn = document.getElementById("search-it")
    const enBtn = document.getElementById("search-en")
    const resultDiv = document.querySelector("#search-content > div > div:nth-child(2)")

    document.getElementById("search-prev").addEventListener("click", () => {
        prevPage().then(({ page, hasPrev, hasNext }) => {
            while (resultDiv.firstChild) {
                resultDiv.firstChild.remove()
            }

            for (const pair of page) {
                const elem = createPhraseElement([pair[1], pair[0]])
                resultDiv.appendChild(elem)
            }

            if (page.length > 0) {
                document.getElementById("search-navigation").classList.remove("hidden")
            } else {
                document.getElementById("search-navigation").classList.add("hidden")
            }

            document.getElementById("search-prev").disabled = !hasPrev
            document.getElementById("search-next").disabled = !hasNext
        })
    })

    document.getElementById("search-next").addEventListener("click", () => {
        nextPage().then(({ page, hasPrev, hasNext }) => {
            while (resultDiv.firstChild) {
                resultDiv.firstChild.remove()
            }

            for (const pair of page) {
                const elem = createPhraseElement([pair[1], pair[0]])
                resultDiv.appendChild(elem)
            }

            if (page.length > 0) {
                document.getElementById("search-navigation").classList.remove("hidden")
            } else {
                document.getElementById("search-navigation").classList.add("hidden")
            }

            document.getElementById("search-prev").disabled = !hasPrev
            document.getElementById("search-next").disabled = !hasNext
        })
    })

    itBtn.addEventListener("click", () => {
        const text = textInput.value
        console.log("searchin text")
        searchText(text, "it", 0).then(({ page, hasPrev, hasNext }) => {
            while (resultDiv.firstChild) {
                resultDiv.firstChild.remove()
            }

            for (const pair of page) {
                const elem = createPhraseElement([pair[1], pair[0]])
                resultDiv.appendChild(elem)
            }

            if (page.length > 0) {
                document.getElementById("search-navigation").classList.remove("hidden")
            } else {
                document.getElementById("search-navigation").classList.add("hidden")
            }

            document.getElementById("search-prev").disabled = !hasPrev
            document.getElementById("search-next").disabled = !hasNext
        })
    })

    enBtn.addEventListener("click", () => {
        const text = textInput.value
        searchText(text, "en", 0).then(({ page, hasPrev, hasNext }) => {
            while (resultDiv.firstChild) {
                resultDiv.firstChild.remove()
            }

            for (const pair of page) {
                resultDiv.appendChild(createPhraseElement(pair))
            }

            if (page.length > 0) {
                document.getElementById("search-navigation").classList.remove("hidden")
            } else {
                document.getElementById("search-navigation").classList.add("hidden")
            }

            document.getElementById("search-prev").disabled = !hasPrev
            document.getElementById("search-next").disabled = !hasNext
        })
    })
})
