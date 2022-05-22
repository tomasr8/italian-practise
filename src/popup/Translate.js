import React, { useState } from "react"
import { setTranslateData, setTranslateInput, setTranslateSourceLang, setTranslateTargetLang } from "./actions"
import { useAppContext } from "./context"
import translate from "./glosbe"
import languages from "./languages.json"
import LanguageSelect from "./LanguageSelect"

import styles from "./Translate.module.scss"

function TranslationItem({ item }) {
    const summary = item.phraseSummary.map(s => <em key={s}>{s}</em>)
    const definitions = item.definitions.map(({ language, definition }) => (
        <div key={definition}>
            <em>{language}</em>
            <span className={styles.definition}>{definition}</span>
        </div>
    ))
    const examples = item.examples.map(({ original, translation }, i) => (
        <div key={i}>
            <div className={styles.original}>
                <span dangerouslySetInnerHTML={{ __html: original }} />
            </div>
            <div className={styles.translated}>
                <span dangerouslySetInnerHTML={{ __html: translation }} />
            </div>
        </div>
    ))

    return (
        <div className={styles["translation-item"]}>
            <div className={styles["translation-container"]}>
                <span className={styles["translation"]}>{item.translation}</span>
                {summary}
            </div>
            <div className={styles["definition-container"]}>{definitions}</div>
            <div className={styles["examples-container"]}>{examples}</div>
        </div>
    )
}

export default function Translate() {
    const { state, dispatch } = useAppContext()
    const { sourceLang, targetLang, value, data } = state.ui.translate

    const onClick = async () => {
        const result = await translate(sourceLang, targetLang, value)
        dispatch(setTranslateData(result))
    }

    const onSwap = () => {
        dispatch(setTranslateSourceLang(targetLang))
        dispatch(setTranslateTargetLang(sourceLang))
    }

    return (
        <>
            <div className={styles["margin-bottom"]}>
                <input
                    type="text"
                    className={styles.input}
                    value={value}
                    autoComplete="off"
                    placeholder="Translate online using Glosbe"
                    onChange={e => dispatch(setTranslateInput(e.target.value))}
                />
            </div>
            <div className={styles["flex-search"]}>
                <LanguageSelect
                    languages={languages}
                    value={sourceLang}
                    onChange={value => dispatch(setTranslateSourceLang(value))}
                />
                <button className={`button button-clear ${styles["swap-button"]}`} onClick={onSwap}>
                    <span className="material-icons">swap_horiz</span>
                </button>
                <LanguageSelect
                    languages={languages}
                    value={targetLang}
                    onChange={value => dispatch(setTranslateTargetLang(value))}
                    menuStyles={{ left: -50 }}
                />
                <button className="button" onClick={onClick}>
                    Search
                </button>
            </div>
            {data !== null && (
                <div className={styles["translate-results"]}>
                    {data.items.map((item, i) => (
                        <TranslationItem key={i} item={item} />
                    ))}
                </div>
            )}
        </>
    )
}
