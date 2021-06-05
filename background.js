function randInt(n) {
    return Math.floor(Math.random() * n)
}

function loadPhrases() {
    const url = browser.extension.getURL("phrases.txt")
    return fetch(url)
        .then(res => res.text())
        .then(text => text.split(/\r?\n/).map(row => row.split("\t")))
}

class Practise {
    constructor(phrases) {
        this.phrases = phrases
        this.index = -1
        this.history = []
    }

    next() {
        if (this.index < this.history.length - 1) {
            this.index++
            return this.history[this.index]
        }

        this.history.push(this.phrases[randInt(this.phrases.length)])
        this.index++
        return this.history[this.index]
    }

    prev() {
        this.index = Math.max(this.index - 1, 0)
        return this.history[this.index]
    }
}

class Search {
    constructor(phrases) {
        this.phrases = phrases
        this.text = null
        this.language = null
        this.startIndex = 0
        this.pages = []
        this.pageIndex = 0
        this.maxPerPage = 5
    }

    hasMore() {
        return this.startIndex < this.phrases.length
    }

    hasNext() {
        return this.pageIndex + 1 < this.pages.length
    }

    hasPrev() {
        return this.pageIndex - 1 >= 0
    }

    search(text, language) {
        this.reset(text, language)

        const matches = this._search()

        this.pages.push(matches)
        const hasNext = this.hasMore()

        return {
            page: this.pages[this.pageIndex],
            hasPrev: false,
            hasNext,
            language
        }
    }

    next() {
        if (this.hasNext()) {
            this.pageIndex++

            const hasNext = this.hasNext() || this.hasMore()
            const language = this.language

            return {
                page: this.pages[this.pageIndex],
                hasPrev: true,
                hasNext,
                language
            }
        }

        const matches = this._search()

        this.pages.push(matches)
        this.pageIndex++
        const hasNext = this.hasMore()
        const language = this.language

        return {
            page: this.pages[this.pageIndex],
            hasPrev: true,
            hasNext,
            language
        }
    }

    prev() {
        if (this.hasPrev()) {
            this.pageIndex--
            const hasPrev = this.hasPrev()
            const language = this.language

            return {
                page: this.pages[this.pageIndex],
                hasPrev,
                hasNext: true,
                language
            }
        }

        const hasNext = this.hasNext()
        const language = this.language

        return {
            page: this.pages[0],
            hasPrev: false,
            hasNext,
            language
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

    reset(text, language) {
        this.text = text.toLowerCase()
        this.language = language
        this.startIndex = 0
        this.pages = []
        this.pageIndex = 0
    }
}

loadPhrases().then(phrases => {
    const practise = new Practise(phrases)
    const search = new Search(phrases)

    browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
        switch (request.type) {
            case "practise-prev":
                sendResponse({ response: practise.prev() })
                break
            case "practise-next":
                sendResponse({ response: practise.next() })
                break
            case "search-initial":
                sendResponse({ response: search.search(request.text, request.language) })
                break
            case "search-prev":
                sendResponse({ response: search.prev() })
                break
            case "search-next":
                sendResponse({ response: search.next() })
                break
            default:
                throw new Error(`Unknown request type <${request.type}>`)
        }
    })
})
