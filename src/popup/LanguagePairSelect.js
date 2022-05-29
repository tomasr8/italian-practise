import React, { useEffect, useState } from "react"

import styles from "./Translate.module.scss"
import LanguageSelect from "./LanguageSelect"
import languages from "./languages.json"

export default function LanguagePairSelect({ pairs, source, target, onChange }) {
    const mapping = {}
    pairs.forEach(([a, b]) => {
        if (!mapping[a]) {
            mapping[a] = []
        }
        if (!mapping[b]) {
            mapping[b] = []
        }
        mapping[a].push(b)
        mapping[b].push(a)
    })

    const all = [...new Set([...pairs.map(p => p[0]), ...pairs.map(p => p[1])])]
    const sourceLangs = {
        names: Object.fromEntries(
            Object.entries(languages.names).filter(([key, value]) => {
                return all.includes(key)
            })
        ),
        icons: Object.fromEntries(
            Object.entries(languages.icons).filter(([key, value]) => {
                return all.includes(key)
            })
        )
    }

    const targetLangs = source === null ? sourceLangs : {
        names: Object.fromEntries(
            Object.entries(languages.names).filter(([key, value]) => {
                return mapping[source] && mapping[source].includes(key)
            })
        ),
        icons: Object.fromEntries(
            Object.entries(languages.icons).filter(([key, value]) => {
                return mapping[source] && mapping[source].includes(key)
            })
        )
    }

    // console.log(pairs)
    console.log(mapping)
    console.log("SRC", sourceLangs)
    console.log("TARGET", targetLangs)
    console.log(source, target)

    useEffect(() => {
        if(source !== null && (!mapping[source] || !mapping[source].includes(target))) {
            onChange(source, null)
        }
    }, [source, target])

    return (
        <div className={styles["flex-search"]}>
            <LanguageSelect languages={sourceLangs} value={source} onChange={value => onChange(value, target)} />
            <button className={`button button-clear ${styles["swap-button"]}`} onClick={() => onChange(target, source)}>
                <span className="material-icons">swap_horiz</span>
            </button>
            <LanguageSelect
                languages={targetLangs}
                value={target}
                onChange={value => onChange(source, value)}
                defaultOpen={source !== null && target === null}
                menuStyles={{ left: "unset", right: 0 }}
            />
        </div>
    )
}
