export const SET_THEME = "Set theme"
export const SET_TAB = "Set current tab"
export const SET_TRANSLATE_INPUT = "Set translate input"
export const SET_SEARCH_INPUT = "Set search input"
export const SET_TRANSLATE_SOURCE_LANG = "Set translate source language"
export const SET_TRANSLATE_TARGET_LANG = "Set translate target language"
export const SET_SEARCH_SOURCE_LANG = "Set search source language"
export const SET_SEARCH_TARGET_LANG = "Set search target language"
export const SET_TRANSLATE_DATA = "Set translate data"
export const SET_SEARCH_DATA = "Set search data"
export const SET_LOCAL_LANGUAGE_METADATA = "Set local languages"
export const SET_REMOTE_LANGUAGE_METADATA = "Set remote languages"
export const DELETE_LANGUAGE = "Delete language"

export function setTheme(theme, persist = true) {
    return { type: SET_THEME, theme, persist }
}

export function setTab(tab) {
    return { type: SET_TAB, tab }
}

export function setTranslateInput(value) {
    return { type: SET_TRANSLATE_INPUT, value }
}

export function setSearchInput(value) {
    return { type: SET_SEARCH_INPUT, value }
}

export function setTranslateSourceLang(value) {
    return { type: SET_TRANSLATE_SOURCE_LANG, value }
}

export function setTranslateTargetLang(value) {
    return { type: SET_TRANSLATE_TARGET_LANG, value }
}

export function setTranslateData(data) {
    return { type: SET_TRANSLATE_DATA, data }
}

export function setSearchSourceLang(value) {
    return { type: SET_SEARCH_SOURCE_LANG, value }
}

export function setSearchTargetLang(value) {
    return { type: SET_SEARCH_TARGET_LANG, value }
}

export function setSearchData(data) {
    return { type: SET_SEARCH_DATA, data }
}

export function setLocalLanguageMetadata(data, persist = true) {
    return { type: SET_LOCAL_LANGUAGE_METADATA, data, persist }
}

export function setRemoteLanguageMetadata(data, persist = true) {
    return { type: SET_REMOTE_LANGUAGE_METADATA, data, persist }
}

export function deleteLanguage(pair, persist = true) {
    return { type: DELETE_LANGUAGE, pair, persist }
}
