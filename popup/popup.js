function getPhrase(msg) {
    return browser.runtime.sendMessage(msg).then(({ response }) => {
        const pair = response.split("\t")
        return pair
    })
}

function isEqual(translation, input) {
    const endings = [".", "!", "?"]

    translation = translation.toLowerCase()
    input = input.toLowerCase()

    if (endings.includes(translation[translation.length - 1])) {
        translation = translation.slice(0, -1)
    }

    if (endings.includes(input[input.length - 1])) {
        input = input.slice(0, -1)
    }

    return translation === input
}

document.addEventListener("DOMContentLoaded", function () {
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

    textarea.addEventListener("keypress", event => {
        if (event.code === "Enter") {
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
        if (event.key === "ArrowRight") {
            textarea.classList.remove("red")
            textarea.classList.remove("green")

            getPhrase({ type: "next", rand: Math.random() }).then(p => {
                pair = p
                original.innerText = pair[1]
            })
            translation.innerText = ""
            textarea.value = ""
        } else if (event.key === "ArrowLeft") {
            textarea.classList.remove("red")
            textarea.classList.remove("green")

            getPhrase({ type: "prev" }).then(p => {
                pair = p
                original.innerText = pair[1]
            })
            translation.innerText = ""
            textarea.value = ""
        } else if (event.key === "ArrowDown") {
            onCheck()
        }
    })

    textarea.addEventListener("input", () => {
        textarea.classList.remove("red")
        textarea.classList.remove("green")
    })

    // textarea.addEventListener("click", () => {
    //     if(textarea.value === "") {
    //         textarea.classList.remove("red")
    //         textarea.classList.remove("green")
    //     }
    // })

    next.addEventListener("click", () => {
        textarea.classList.remove("red")
        textarea.classList.remove("green")

        getPhrase({ type: "next", rand: Math.random() }).then(p => {
            pair = p
            original.innerText = pair[1]
        })
        translation.innerText = ""
        textarea.value = ""
    })

    check.addEventListener("click", () => {
        onCheck()
    })

    getPhrase({ type: "next" }).then(p => {
        pair = p
        original.innerText = pair[1]
    })
})
