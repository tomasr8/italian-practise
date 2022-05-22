import React, { useState, useEffect, useReducer, createContext, useMemo } from "react"

import { initialState, rootReducer } from "./state"
import { AppContext } from "./context"
import Tabs from "./Tabs"
import Translate from "./Translate"
import Search from "./Search"
import Settings from "./Settings"
import styles from "./App.module.scss"
import { setLocalLanguageMetadata, setRemoteLanguageMetadata, setTheme } from "./actions"
import { getLocalLanguageMetadata, getTheme } from "./storage"

async function getDefaultTheme() {
    const storedTheme = await getTheme()
    const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
    const defaultDark = storedTheme === null && prefersDark

    if (defaultDark) {
        return "dark"
    } else if (storedTheme) {
        return storedTheme
    } else {
        return "purple"
    }
}

export default function App() {
    const [state, dispatch] = useReducer(rootReducer, initialState)
    const { tab } = state.ui

    const contextValue = useMemo(() => {
        return { state, dispatch }
    }, [state, dispatch])

    useEffect(async () => {
        const theme = await getDefaultTheme()
        dispatch(setTheme(theme, false))
    }, [])

    useEffect(async () => {
        const data = await getLocalLanguageMetadata()
        if(!data) {
            dispatch(setLocalLanguageMetadata({}))
        } else {
            dispatch(setLocalLanguageMetadata(data, false))
        }
    }, [])

    useEffect(() => {
        fetch("https://raw.githubusercontent.com/tomasr8/tatoeba-mirror/main/meta.json")
            .then(res => res.json())
            .then(json => dispatch(setRemoteLanguageMetadata(json)))
    }, [])

    return (
        <AppContext.Provider value={contextValue}>
            <div data-theme={state.theme}>
                <Tabs tab={tab} dispatch={dispatch} />
                <div className={styles.container}>
                    {tab === "translate" && <Translate />}
                    {tab === "search" && <Search />}
                    {tab === "settings" && <Settings theme={state.theme} dispatch={dispatch} />}
                </div>
            </div>
        </AppContext.Provider>
    )
}
