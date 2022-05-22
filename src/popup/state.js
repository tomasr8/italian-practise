import {
    SET_THEME,
    SET_TAB,
    SET_TRANSLATE_INPUT,
    SET_SEARCH_INPUT,
    SET_TRANSLATE_SOURCE_LANG,
    SET_TRANSLATE_TARGET_LANG,
    SET_TRANSLATE_DATA,
    SET_SEARCH_SOURCE_LANG,
    SET_SEARCH_TARGET_LANG,
    SET_LOCAL_LANGUAGE_METADATA,
    SET_REMOTE_LANGUAGE_METADATA,
    DELETE_LANGUAGE
} from "./actions"
import { setLocalLanguageMetadata, setRemoteLanguageMetadata, setTheme } from "./storage"

function getInitialUI() {
    const ui = window.localStorage.getItem("ui")
    return ui
        ? JSON.parse(ui)
        : {
              tab: "translate",
              translate: { value: "", data: null, sourceLang: "eng", targetLang: "ita" },
              search: { value: "", data: null, sourceLang: "eng", targetLang: "ita" }
          }
}

function getInitialLanguages() {
    return {
        localMetadata: {},
        remoteMetadata: {}
    }
}

function combineReducers(reducers) {
    return (state = {}, action) => {
        const newState = {}
        for (const key in reducers) {
            newState[key] = reducers[key](state[key], action)
        }
        return newState
    }
}

function themeReducer(state, action) {
    switch (action.type) {
        case SET_THEME:
            if (action.persist) {
                setTheme(action.theme)
            }
            return action.theme
        default:
            return state
    }
}

function UIReducer(state, action) {
    switch (action.type) {
        case SET_TAB: {
            const newState = { ...state, tab: action.tab }
            window.localStorage.setItem("ui", JSON.stringify(newState))
            return newState
        }
        case SET_TRANSLATE_INPUT: {
            const newState = { ...state, translate: { ...state.translate, value: action.value } }
            window.localStorage.setItem("ui", JSON.stringify(newState))
            return newState
        }
        case SET_SEARCH_INPUT: {
            const newState = { ...state, search: { ...state.search, value: action.value } }
            window.localStorage.setItem("ui", JSON.stringify(newState))
            return newState
        }
        case SET_TRANSLATE_SOURCE_LANG: {
            const newState = { ...state, translate: { ...state.translate, sourceLang: action.value } }
            window.localStorage.setItem("ui", JSON.stringify(newState))
            return newState
        }
        case SET_TRANSLATE_TARGET_LANG: {
            const newState = { ...state, translate: { ...state.translate, targetLang: action.value } }
            window.localStorage.setItem("ui", JSON.stringify(newState))
            return newState
        }
        case SET_TRANSLATE_DATA: {
            const newState = { ...state, translate: { ...state.translate, data: action.data } }
            window.localStorage.setItem("ui", JSON.stringify(newState))
            return newState
        }
        case SET_SEARCH_SOURCE_LANG: {
            const newState = { ...state, search: { ...state.search, sourceLang: action.value } }
            window.localStorage.setItem("ui", JSON.stringify(newState))
            return newState
        }
        case SET_SEARCH_TARGET_LANG: {
            const newState = { ...state, search: { ...state.search, targetLang: action.value } }
            window.localStorage.setItem("ui", JSON.stringify(newState))
            return newState
        }
        default:
            return state
    }
}

function languageReducer(state, action) {
    switch (action.type) {
        case SET_LOCAL_LANGUAGE_METADATA: {
            console.log(action)
            const localMetadata = { ...state.localMetadata, ...action.data }
            if (action.persist) {
                setLocalLanguageMetadata(localMetadata)
            }
            return { ...state, localMetadata }
        }
        case DELETE_LANGUAGE: {
            const { [action.pair]: _, ...rest } = state.localMetadata
            if (action.persist) {
                setLocalLanguageMetadata(rest)
            }
            return { remoteMetadata: state.remoteMetadata, localMetadata: rest }
        }
        case SET_REMOTE_LANGUAGE_METADATA: {
            if (action.persist) {
                setRemoteLanguageMetadata(action.data)
            }
            return { ...state, remoteMetadata: { ...state.remoteMetadata, ...action.data } }
        }
        default:
            return state
    }
}

export const initialState = {
    theme: "purple",
    ui: getInitialUI(),
    languages: getInitialLanguages()
}

export const rootReducer = combineReducers({ theme: themeReducer, ui: UIReducer, languages: languageReducer })
