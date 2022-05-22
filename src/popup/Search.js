import React, { useState } from "react"

import { useAppContext } from "./context"
import styles from "./Translate.module.scss"
import search from "./Search.module.scss"
import LanguageSelect from "./LanguageSelect"
import languages from "./languages.json"
import { setSearchInput, setSearchSourceLang, setSearchTargetLang } from "./actions"

export default function Search() {
    const { state, dispatch } = useAppContext()
    const { sourceLang, targetLang, value, data } = state.ui.search

    const onChange = e => dispatch(setSearchInput(e.target.value))

    const onSwap = () => {
        dispatch(setSearchSourceLang(targetLang))
        dispatch(setSearchTargetLang(sourceLang))
    }

    return (
        <>
            <div className={styles["margin-bottom"]}>
                <input type="text" autoComplete="off" placeholder="Search the offline corpus" value={value} onChange={onChange} />
            </div>
            <div className={styles["flex-search"]}>
                <LanguageSelect
                    languages={languages}
                    value={sourceLang}
                    onChange={value => dispatch(setSearchSourceLang(value))}
                />
                <button className={`button button-clear ${styles["swap-button"]}`} onClick={onSwap}>
                    <span className="material-icons">swap_horiz</span>
                </button>
                <LanguageSelect
                    languages={languages}
                    value={targetLang}
                    onChange={value => dispatch(setSearchTargetLang(value))}
                    menuStyles={{ left: -50 }}
                />
                <button className="button" onClick={() => {}}>
                    Search
                </button>
            </div>

            {data && (
                <div className={search["search-navigation"]}>
                    <div>
                        <button className="button button-clear">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                height="24px"
                                viewBox="0 0 24 24"
                                width="24px"
                                fill="#000000"
                            >
                                <path d="M0 0h24v24H0V0z" fill="none" />
                                <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12l4.58-4.59z" />
                            </svg>
                        </button>
                    </div>
                    <div>
                        <button className="button button-clear">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                height="24px"
                                viewBox="0 0 24 24"
                                width="24px"
                                fill="#000000"
                            >
                                <path d="M0 0h24v24H0z" fill="none" />
                                <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
                            </svg>
                        </button>
                    </div>
                </div>
            )}
        </>
    )
}
