const storedTheme = window.localStorage.getItem("theme")
const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
const defaultDark = storedTheme === null && prefersDark

export function getTheme() {
    if (defaultDark) {
        return "dark"
    } else if (storedTheme) {
        return storedTheme
    } else {
        return "default"
    }
}
