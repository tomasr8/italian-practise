import createNotfound from "./NotFound"
import translate from "./glosbe"
import { getState, setState } from "./state"

function createTranslationElement(item) {
    const summary = item.phraseSummary.map(s => `<em>${s}</em>`).join(" ")
    const definitions = item.definitions
        .map(def => `<div><em>${def.language}</em><span class="definition">${def.definition}</span></div>`)
        .join("")
    const examples = item.examples
        .map(
            ({ original, translation }) =>
                `<div class="original"><span>${original}</span></div><div class="translated"><span>${translation}</span></div>`
        )
        .join("")

    const html = `
    <div class="translation-item">
        <div class="translation-container">
            <span class="translation">${item.translation}</span> ${summary}
        </div>
        <div class="definition-container">
            ${definitions}
        </div>
        <div class="examples-container">
            ${examples}
        </div>
    </div>
`
    return html
}

function createTranslations(items) {
    const translations = items.map(item => createTranslationElement(item)).join("")
    const html = `<div>${translations}</div>`
    const parser = new DOMParser()
    return parser.parseFromString(html, "text/html").body.childNodes[0]
}

document.addEventListener("DOMContentLoaded", async () => {
    const textInput = document.getElementById("translate-text")
    const source = document.getElementById("translate-source-lang")
    const target = document.getElementById("translate-target-lang")
    const translateBtn = document.getElementById("translate-btn")
    const resultDiv = document.getElementById("translate-results")

    async function onTranslate() {
        const q = textInput.value
        if (!q) {
            return
        }

        const { summary, items } = await translate(source.value, target.value, q)
        if (!summary && items.length === 0) {
            resultDiv.replaceChildren(createNotfound())
        } else {
            resultDiv.replaceChildren(createTranslations(items))
        }
        setState({
            translation: {
                q: textInput.value,
                sourceLang: source.value,
                targetLang: target.value,
                result: { summary, items }
            }
        })
    }

    translateBtn.addEventListener("click", onTranslate)

    const content = document.getElementById("translate-content")
    document.addEventListener("keydown", async event => {
        if (content.classList.contains("hidden")) {
            return
        }

        if (event.key === "Enter") {
            onTranslate()
        }
    })

    const { translation } = await getState()
    resultDiv.replaceChildren(createTranslations(translation.result.items))
    textInput.value = translation.q
    source.value = translation.sourceLang
    target.value = translation.targetLang
})
