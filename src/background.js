import pako from "pako"

const PAGE_LIMIT = 5

class SearchProvider {
    constructor(phrases, q) {
        this.init(phrases, q)
    }

    init(phrases = null, q = null) {
        this.phrases = phrases
        this.q = q
        this.searchIndex = 0
        this.pages = []
        this.pageIndex = -1
    }

    search() {
        if (!this.hasMore()) {
            return { hasPrev: this.pageIndex > 0, hasNext: false }
        }

        let matches = []
        let hasNext = false
        let searchIndex
        let i
        for (i = this.searchIndex; i < this.phrases.length; i++) {
            const { original, translated } = this.phrases[i]
            if (original.toLowerCase().includes(this.q.toLowerCase())) {
                matches.push({ original, translated })
            }

            if (matches.length === PAGE_LIMIT) {
                searchIndex = i + 1
            } else if (matches.length === PAGE_LIMIT + 1) {
                hasNext = true
                break
            }
        }
        this.searchIndex = searchIndex
        this.pages.push(matches.slice(0, PAGE_LIMIT))
        return { page: this.pages[++this.pageIndex], hasPrev: this.pageIndex > 0, hasNext }
    }

    next() {
        return {
            page: this.pageIndex < this.pages.length - 1 ? this.pages[++this.pageIndex] : null,
            hasPrev: this.pageIndex > 0,
            hasNext: this.pageIndex < this.pages.length - 1 || this.hasMore()
        }
    }

    prev() {
        return {
            page: this.pageIndex > 0 ? this.pages[--this.pageIndex] : null,
            hasPrev: this.pageIndex > 0,
            hasNext: this.pageIndex < this.pages.length - 1
        }
    }

    hasMore() {
        return this.searchIndex < this.phrases.length
    }
}

let state = {
    currTab: 1,
    search: {
        sourceLang: "en",
        targetLang: "it",
        q: "",
        result: {
            page: null,
            hasPrev: false,
            hasNext: false
        }
    },
    translation: {
        sourceLang: "en",
        targetLang: "it",
        q: "",
        result: {
            summary: null,
            items: []
        }
    }
}

async function main() {
    const url = browser.extension.getURL(`combined.json.gz`)
    const data = await fetch(url)
        .then(res => res.arrayBuffer())
        .then(data => {
            const compressed = new Uint8Array(data)
            return JSON.parse(pako.inflate(compressed, { to: "string" }))
        })

    let provider
    browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
        switch (request.type) {
            case "search-init": {
                const { sourceLang, targetLang, q } = request
                const phrases = data[`${sourceLang}-${targetLang}`]
                provider = new SearchProvider(phrases, q)
                provider.init(phrases, q)
                const result = provider.search(q)
                state.search = { ...state.search, sourceLang, targetLang, q, result }
                sendResponse({ response: result })
                break
            }
            case "search-next": {
                let result = provider.next()
                if (!result.page) {
                    result = provider.search()
                }
                state.search.result = result
                sendResponse({ response: result })
                break
            }
            case "search-prev": {
                const result = provider.prev()
                state.search.result = result
                sendResponse({ response: result })
                break
            }
            case "get-state":
                sendResponse({ response: state })
                break
            case "set-state": {
                const { state: newState } = request
                state = { ...state, ...newState }
                break
            }
            default:
                throw new Error(`Unknown request type <${request.type}>`)
        }
    })
}

main()
