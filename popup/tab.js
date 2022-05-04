function applyOne(elems, index, className, add, remove) {
    for (let i = 0; i < elems.length; i++) {
        if (i === index) {
            elems[i].classList[add](className)
        } else {
            elems[i].classList[remove](className)
        }
    }
}

function addOne(elems, index, className) {
    applyOne(elems, index, className, "add", "remove")
}

function removeOne(elems, index, className) {
    applyOne(elems, index, className, "remove", "add")
}

document.addEventListener("DOMContentLoaded", () => {
    const buttons = [
        document.getElementById("translate"),
        document.getElementById("search")
    ]

    const content = [
        document.getElementById("translate-content"),
        document.getElementById("search-content")
    ]

    const SVGs = [
        document.getElementById("translate-svg"),
        document.getElementById("search-svg")
    ]

    buttons.forEach((button, i) => {
        button.addEventListener("click", () => {
            addOne(buttons, i, "button-selected")
            removeOne(content, i, "hidden")
            removeOne(SVGs, i, "opacity")
        })
    })
})
