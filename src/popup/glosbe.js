function getSummary(elem) {
    const phraseSummary = [...elem.querySelectorAll(".phrase__summary__field")].map(elem => elem.textContent.trim())
    const definitions = [...elem.querySelectorAll("ul.list-disc li")].map(elem => elem.textContent.trim())

    return { phraseSummary, definitions }
}

function getTranslation(elem) {
    const translationElem = elem.querySelector(".translation__item__phrase .translation")
    if (!translationElem) {
        return null
    }
    const translation = translationElem.textContent.trim()

    const phraseSummary = [...elem.querySelectorAll(".phrase__summary__field")].map(elem => elem.textContent.trim())
    const definitionElem = elem.querySelector(".translation__definition")
    let definitions = []
    if (definitionElem) {
        const languages = [...definitionElem.querySelectorAll("span.translation__definition__language")].map(elem =>
            elem.textContent.trim()
        )
        const defs = [...definitionElem.querySelectorAll("span:not(.translation__definition__language)")].map(elem =>
            elem.innerHTML.trim()
        )
        definitions = languages.map((language, i) => ({ language, definition: defs[i] }))
    }

    const examples = [...elem.querySelectorAll(".translation__example")].map(elem => {
        return {
            original: elem.querySelector("p:first-child").innerHTML.trim(),
            translation: elem.querySelector("p:last-child").innerHTML.trim()
        }
    })
    return { translation, phraseSummary, definitions, examples }
}

async function fetchFromGlosbe(phrase, sourceLang, targetLang) {
    return await fetch(`https://glosbe.com/${sourceLang}/${targetLang}/${phrase}`).then(res => res.text())
}

function parseResponse(html) {
    const parser = new DOMParser()
    const body = parser.parseFromString(html, "text/html").body

    const summaryElem = body.querySelector(".phrase__translation__summary")
    const summary = getSummary(summaryElem)
    console.log("SUMMARY", summary)

    const list = body.querySelector(".translations__list")
    if (list === null) {
        return { summary }
    }

    const items = [...list.querySelectorAll(".translation__item")]
        .map(item => getTranslation(item))
        .filter(tr => tr !== null)
    console.log(items)
    return { summary, items }
}

export default async function translate(phrase, sourceLang, targetLang) {
    const html = await fetchFromGlosbe(phrase, sourceLang, targetLang)
    return parseResponse(html)
}
