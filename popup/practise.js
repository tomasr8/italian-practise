function sendMesage(msg) {
    return browser.runtime.sendMessage(msg).then(({ response }) => {
        return response
    })
}

function prevPhrase() {
    return sendMesage({ type: "practise-prev" })
}

function nextPhrase() {
    return sendMesage({ type: "practise-next" })
}

function normalizeString(str) {
    const ignoredEndings = [".", "!", "?"]

    str = str.toLowerCase()

    const last = str[str.length - 1]
    if (ignoredEndings.includes(last)) {
        str = str.slice(0, -1)
    }

    return str
}

function isEqual(translation, input) {
    translation = normalizeString(translation)
    input = normalizeString(input)

    return translation === input
}

function isVisible() {
    return !document.getElementById("practise-content").classList.contains("hidden")
}

document.addEventListener("DOMContentLoaded", () => {
    let pair = ["", ""]

    const original = document.getElementById("original")
    const translation = document.getElementById("translation")
    const next = document.getElementById("next")
    const check = document.getElementById("check")
    const textarea = document.getElementById("input")

    function onCheck() {
        translation.innerText = pair[0]
        const input = textarea.value

        if (textarea.value !== "") {
            if (isEqual(pair[0], input)) {
                textarea.classList.remove("red")
                textarea.classList.add("green")
            } else {
                textarea.classList.remove("green")
                textarea.classList.add("red")
            }
        }
    }

    function resetTextarea() {
        textarea.classList.remove("red")
        textarea.classList.remove("green")
    }

    function changePhrase(getPhrase) {
        resetTextarea()

        translation.innerText = ""
        textarea.value = ""

        getPhrase().then(p => {
            pair = p
            original.innerText = pair[1]
        })
    }

    textarea.addEventListener("keypress", event => {
        if (event.code === "Enter" && isVisible()) {
            event.stopPropagation()
        }
    })

    textarea.addEventListener("keydown", event => {
        if (event.key === "ArrowRight" || event.key === "ArrowDown" || event.key === "ArrowLeft") {
            event.stopPropagation()
        }
    })

    document.addEventListener("keypress", event => {
        if (event.code === "Enter") {
            onCheck()
        }
    })

    document.addEventListener("keydown", event => {
        console.log(event.key, isVisible())
        if (event.key === "ArrowLeft" && isVisible()) {
            changePhrase(prevPhrase)
        } else if (event.key === "ArrowRight" && isVisible()) {
            changePhrase(nextPhrase)
        } else if (event.key === "ArrowDown" && isVisible()) {
            onCheck()
        }
    })

    textarea.addEventListener("input", () => {
        resetTextarea()
    })

    next.addEventListener("click", () => {
        changePhrase(nextPhrase)
    })

    check.addEventListener("click", () => {
        onCheck()
    })

    nextPhrase().then(p => {
        pair = p
        original.innerText = pair[1]
    })
})
