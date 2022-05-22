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

function normalize(pair) {
    const [source, target] = pair.split("-")
    return source < target ? pair : `${target}-${source}`
}

async function getLanguagePair(pair) {
    pair = normalize(pair)
    const key = `languagePairs.${pair}`
    return browser.storage.local.get(`languagePairs.${pair}`).then(data => data[key])
}

async function main() {
    let state = {
        value: "",
        data: null,
        sourceLang: "eng",
        targetLang: "ces",
        hasPrev: false,
        hasNext: false
    }
    const languageData = {}
    let provider
    browser.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
        switch (request.type) {
            case "search-init": {
                const { sourceLang, targetLang, q } = request
                const pair = normalize(`${sourceLang}-${targetLang}`)

                if (!languageData[pair]) {
                    languageData[pair] = await getLanguagePair(pair)
                }

                provider = new SearchProvider(languageData[pair], q)
                provider.init(languageData[pair], q)
                const result = provider.search(q)
                state = { ...state, sourceLang, targetLang, q, result }
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
