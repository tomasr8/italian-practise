const history = []
let index = -1

function loadPhrases() {
    const url = browser.extension.getURL("phrases.txt")
    return fetch(url).then(res => res.text())
}

function randomIndex(rand, length) {
    return Math.floor(rand * length)
}

// function searchText(phrases, { text, language, startIndex }) {
//     const matches = []

//     text = text.toLowerCase()
//     const phraseIndex = language === "it" ? 1 : 0

//     for (let i = startIndex; i < phrases.length; i++) {
//         const phrase = phrases[i][phraseIndex]

//         if (phrase.toLowerCase().includes(text)) {
//             matches.push(phrases[i])
//             if (matches.length === 5) {
//                 break
//             }
//         }
//     }

//     return matches
// }

class Search {
    constructor(phrases) {
        this.phrases = phrases
        this.text = null
        this.language = null
        this.pages = []
        this.pageIndex = 0
        this.maxPerPage = 5
        this.startIndex = 0
    }

    hasNext() {
        return (this.pageIndex + 1 < this.pages.length) || this.startIndex < this.phrases.length
    }

    hasPrev() {
        return this.pageIndex - 1 >= 0
    }

    search(text, language, startIndex) {
        this.reset()
        this.text = text.toLowerCase()
        this.language = language
        this.startIndex = startIndex

        console.log("after reset")

        const matches = this._search()

        console.log("after search")

        this.pages.push(matches)
        const hasNext = this.hasNext()

        return {
            page: this.pages[this.pageIndex],
            hasPrev: false,
            hasNext,
        }
    }

    next() {
        if (this.pageIndex + 1 < this.pages.length) {
            this.pageIndex++

            const hasNext = this.hasNext()

            return {
                page: this.pages[this.pageIndex],
                hasPrev: true,
                hasNext,
            }
        }

        const matches = this._search()

        this.pages.push(matches)
        this.pageIndex++
        const hasNext = this.hasNext()

        return {
            page: this.pages[this.pageIndex],
            hasPrev: true,
            hasNext,
        }
    }

    prev() {
        if (this.hasPrev()) {
            this.pageIndex--
            const hasPrev = this.hasPrev()

            return {
                page: this.pages[this.pageIndex],
                hasPrev,
                hasNext: true,
            }
        }

        const hasPrev = this.hasPrev()
        const hasNext = this.hasNext()

        return {
            page: [],
            hasPrev,
            hasNext,
        }
    }

    _search() {
        const matches = []
        const phraseIndex = this.language === "it" ? 1 : 0

        let lastIndex = this.startIndex
        for (let i = this.startIndex; i < this.phrases.length; i++) {
            const phrase = this.phrases[i][phraseIndex].toLowerCase()

            if (phrase.includes(this.text)) {
                if (matches.length === this.maxPerPage) {
                    this.startIndex = lastIndex
                    return matches
                }
                matches.push(this.phrases[i])
                lastIndex = i
            }
        }

        this.startIndex = this.phrases.length
        return matches
    }

    reset() {
        this.text = null
        this.language = null
        this.pages = []
        this.pageIndex = 0
        this.maxPerPage = 5
        this.searchIndex = 0
    }
}

loadPhrases().then(phrases => {
    phrases = phrases.split("\n").map(row => row.split("\t"))
    history.push(randomIndex(Math.random(), phrases.length))
    index = 0

    const search = new Search(phrases)

    browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
        const { type, rand } = request

        if (type === "prev") {
            index = Math.max(index - 1, 0)
            sendResponse({ response: phrases[history[index]] })
        } else if (type === "next") {
            if (rand) {
                history.push(randomIndex(rand, phrases.length))
                index++
            }
            sendResponse({ response: phrases[history[index]] })
        } else if (type === "search") {
            const { text, language, startIndex } = request
            const response = search.search(text, language, startIndex)
            console.log(response)
            sendResponse({ response })
        } else if (type === "next-page") {
            const response = search.next()
            console.log(response)
            sendResponse({ response })
        } else if (type === "prev-page") {
            const response = search.prev()
            console.log(response)
            sendResponse({ response })
        }
    })
})
