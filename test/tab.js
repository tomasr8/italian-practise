document.addEventListener("DOMContentLoaded", () => {
    const translateBtn = document.getElementById("translate")
    const practiseBtn = document.getElementById("practise")
    const searchBtn = document.getElementById("search")

    const translateContent = document.getElementById("translate-content")
    const practiseContent = document.getElementById("practise-content")
    const searchContent = document.getElementById("search-content")

    const translateSVG = document.getElementById("translate-svg")
    const practiseSVG = document.getElementById("practise-svg")
    const searchSVG = document.getElementById("search-svg")


    translateBtn.addEventListener("click", () => {
        translateContent.classList.remove("hidden")
        practiseContent.classList.add("hidden")
        searchContent.classList.add("hidden")

        translateBtn.classList.add("button-selected")
        practiseBtn.classList.remove("button-selected")
        searchBtn.classList.remove("button-selected")

        translateSVG.classList.remove("opacity")
        practiseSVG.classList.add("opacity")
        searchSVG.classList.add("opacity")

        document.body.style.backgroundColor = "white"
    })

    practiseBtn.addEventListener("click", () => {
        translateContent.classList.add("hidden")
        practiseContent.classList.remove("hidden")
        searchContent.classList.add("hidden")

        translateBtn.classList.remove("button-selected")
        practiseBtn.classList.add("button-selected")
        searchBtn.classList.remove("button-selected")

        translateSVG.classList.add("opacity")
        practiseSVG.classList.remove("opacity")
        searchSVG.classList.add("opacity")

        document.body.style.backgroundColor = "white"
    })

    searchBtn.addEventListener("click", () => {
        translateContent.classList.add("hidden")
        practiseContent.classList.add("hidden")
        searchContent.classList.remove("hidden")

        translateBtn.classList.remove("button-selected")
        practiseBtn.classList.remove("button-selected")
        searchBtn.classList.add("button-selected")

        translateSVG.classList.add("opacity")
        practiseSVG.classList.add("opacity")
        searchSVG.classList.remove("opacity")

        console.log("changing color")
        document.body.style.backgroundColor = "#9b4dca"
    })
})