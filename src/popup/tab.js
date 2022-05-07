import { getState, setState } from "./state"

function setActive(btn, icon, content) {
    btn.classList.add("button-selected")
    icon.classList.remove("opacity")
    content.classList.remove("hidden")
}

function setInactive(btn, icon, content) {
    btn.classList.remove("button-selected")
    icon.classList.add("opacity")
    content.classList.add("hidden")
}

document.addEventListener("DOMContentLoaded", async () => {
    const translateBtn = document.getElementById("translate")
    const searchBtn = document.getElementById("search")

    const translateIcon = document.getElementById("translate-svg")
    const searchIcon = document.getElementById("search-svg")

    const translateContent = document.getElementById("translate-content")
    const searchContent = document.getElementById("search-content")

    translateBtn.addEventListener("click", () => {
        setActive(translateBtn, translateIcon, translateContent)
        setInactive(searchBtn, searchIcon, searchContent)
        setState({ currTab: 0 })
    })

    searchBtn.addEventListener("click", () => {
        setActive(searchBtn, searchIcon, searchContent)
        setInactive(translateBtn, translateIcon, translateContent)
        setState({ currTab: 1 })
    })

    const { currTab } = await getState()
    if(currTab === 1) {
        setActive(searchBtn, searchIcon, searchContent)
        setInactive(translateBtn, translateIcon, translateContent)
    }
})
