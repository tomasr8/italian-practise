function searchText(text, language = "it", startIndex = 0) {
    return browser.runtime.sendMessage({ type: "search", text, language, startIndex }).then(({ response }) => {
        return response
    })
}

document.addEventListener("DOMContentLoaded", () => {
    const textInput = document.getElementById("search-text")
    const itBtn = document.getElementById("search-it")
    const enBtn = document.getElementById("search-en")
    const resultDiv = document.querySelector("#search-content div:nth-child(2)")

    itBtn.addEventListener("click", () => {
        const text = textInput.value
        console.log("searchin text")
        searchText(text, "it", 0).then(matches => {
            while (resultDiv.firstChild) {
                resultDiv.firstChild.remove()
            }

            for(const pair of matches) {
                const it = document.createElement("div")
                it.innerText = pair[0]
                resultDiv.appendChild(it)

                const en = document.createElement("div")
                en.innerText = pair[1]
                resultDiv.appendChild(en)
            }
        })
    })

    enBtn.addEventListener("click", () => {
        const text = textInput.value
        searchText(text, "it", 0).then(matches => {
            while (resultDiv.firstChild) {
                resultDiv.firstChild.remove()
            }

            for(const pair of matches) {
                const it = document.createElement("div")
                it.innerText = pair[0]
                resultDiv.appendChild(it)

                const en = document.createElement("div")
                en.innerText = pair[1]
                resultDiv.appendChild(en)
            }
        })
    })

})