const PAGE_LIMIT = 5

function loadPhrases() {
    const url = browser.extension.getURL("phrases.txt")
    return fetch(url)
        .then(res => res.text())
        .then(text => text.split(/\r?\n/).map(row => row.split("\t")))
}

class Search {
    constructor(fileCounts) {
        this.fileCounts = fileCounts
        this.currFileIndex = 0
        this.currLineIndex = 0
        this.pages = []
        this.pageIndex = 0
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

    async loadLanguagePair(sourceLang, targetLang) {
        const url = browser.extension.getURL(`data/${sourceLang}-${targetLang}-0.json`)
        return fetch(url).then(res => res.json())
    }

    searchSingleFile(file) {
        
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

            return {
                page: this.pages[this.pageIndex],
                hasPrev: true,
                hasNext,
            }
        }

        const matches = this._search()

        this.pages.push(matches)
        this.pageIndex++
        const hasNext = this.hasMore()

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

        const hasNext = this.hasNext()

        return {
            page: this.pages[0],
            hasPrev: false,
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

    reset(text, language) {
        this.text = text.toLowerCase()
        this.language = language
        this.startIndex = 0
        this.pages = []
        this.pageIndex = 0
    }
}

loadPhrases().then(phrases => {
    const search = new Search(phrases)

    browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
        switch (request.type) {
            case "search-initial":
                sendResponse({ response: search.search(request.text, request.sourceLang, request.targetLang) })
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
