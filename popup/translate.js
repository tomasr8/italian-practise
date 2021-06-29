const IT = "italian"
const EN = "english"

function createTranslations(translations) {
    translations = translations.map(tr => `<li>${tr}</li>`).join("\n")

    return `
        <ul>
            ${translations}
        </ul>
    `
}

function showTranslations(translations) {
    document.getElementById("translate-results").innerHTML = createTranslations(translations)
}

function fetchTranslations(phrase, sourceLanguage, targetLanguage) {
    const url = `https://context.reverso.net/translation/${sourceLanguage}-${targetLanguage}/${phrase}`

    return fetch(url)
        .then(res => res.text())
        .then(text => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(text, 'text/html');

            const translations = [...doc.querySelectorAll("#translations-content a")]
                .map(elem => elem.innerText.trim())

            return translations
        })
}

document.addEventListener("DOMContentLoaded", () => {
    const textInput = document.getElementById("translate-text")
    const itBtn = document.getElementById("translate-it")
    const enBtn = document.getElementById("translate-en")

    itBtn.addEventListener("click", () => {
        const phrase = textInput.value
        fetchTranslations(phrase, EN, IT).then(showTranslations)
    })

    enBtn.addEventListener("click", () => {
        const phrase = textInput.value
        fetchTranslations(phrase, IT, EN).then(showTranslations)
    })

})
