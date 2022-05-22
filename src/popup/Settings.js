import React, { useState, useEffect } from "react"
import pako from "pako"
import languages from "./languages.json"
import styles from "./Translate.module.scss"
import { deleteLanguage, setLocalLanguageMetadata, setTheme } from "./actions"
import { useAppContext } from "./context"

import settings from "./Settings.module.scss"
import { deleteLanguagePair, setLanguagePair } from "./storage"
import LanguageSelect from "./LanguageSelect"
import { ThemeSelect } from "./LanguageSelect"

function formatPair(source, target) {
    return source < target ? `${source}-${target}` : `${target}-${source}`
}

function formatSize(size) {
    if (size > 1e6) {
        return `${(size / 1e6).toFixed(1)}MB`
    } else if (size > 1e3) {
        return `${Math.round(size / 1e3)}KB`
    } else {
        return `${size}B`
    }
}

async function downloadLanguagePair(pair) {
    return fetch(`https://raw.githubusercontent.com/tomasr8/tatoeba-mirror/main/data/${pair}.json.gz`)
        .then(res => res.arrayBuffer())
        .then(buffer => {
            const compressed = new Uint8Array(buffer)
            return pako.inflate(compressed, { to: "string" })
        })
}

export default function Settings({ theme, dispatch }) {
    const { state } = useAppContext()
    const [original, setOriginal] = useState("eng")
    const [target, setTarget] = useState("fra")
    const [loading, setLoading] = useState(false)
    const remote = state.languages.remoteMetadata
    const local = state.languages.localMetadata

    const onDownload = async () => {
        const pair = formatPair(original, target)
        setLoading(true)
        try {
            const data = await downloadLanguagePair(pair)
            await setLanguagePair(pair, data)
            dispatch(setLocalLanguageMetadata({ [pair]: { version: "0.0.0" } }))
            console.log(data)
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const onDelete = pair => {
        dispatch(deleteLanguage(pair))
        deleteLanguagePair(pair)
    }

    return (
        <div>
            <div style={{ marginBottom: 20, marginTop: 0 }}>
                <div style={{ marginBottom: 10 }}>Visual theme</div>
                <div style={{ margin: "0 auto", width: 200 }}>
                    <ThemeSelect
                        value={theme}
                        onChange={value => dispatch(setTheme(value))}
                        menuStyles={{ minWidth: 200 }}
                    />
                </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 20 }}>
                <span>Languages</span>
                <span
                    className="material-icons-outlined"
                    title="Add more language pairs to use the search functionality"
                    style={{ cursor: "default" }}
                >
                    info
                </span>
            </div>
            <div style={{ display: "flex", gap: 20, padding: "0 10px", marginBottom: 20 }}>
                <LanguageSelect languages={languages} value={original} onChange={value => setOriginal(value)} />
                <LanguageSelect languages={languages} value={target} onChange={value => setTarget(value)} menuStyles={{left: -50}} />
                <span>
                    <button className="button" disabled={loading} onClick={onDownload} style={{ marginBottom: 0 }}>
                        Add
                    </button>
                    {loading && <span className={styles.loader}></span>}
                </span>
            </div>
            <table className={settings.table}>
                <tbody>
                    {Object.keys(local).map(pair => {
                        const [original, target] = pair.split("-")
                        return (
                            <tr key={pair} className={settings.delete}>
                                <td>{languages.names[original]}</td>
                                <td style={{ fontSize: 20 }}>{languages.icons[original]}</td>
                                <td style={{ textAlign: "center", padding: "0 5px" }}>
                                    <span className="material-icons-outlined" style={{ verticalAlign: "middle" }}>
                                        horizontal_rule
                                    </span>
                                </td>
                                <td>{languages.names[target]}</td>
                                <td style={{ fontSize: 20 }}>{languages.icons[target]}</td>
                                <td style={{ paddingLeft: 20 }}>
                                    <button
                                        className={`button button-clear ${settings["button-delete"]}`}
                                        onClick={() => onDelete(pair)}
                                    >
                                        <span style={{ verticalAlign: "middle" }} className="material-icons">
                                            delete
                                        </span>
                                    </button>
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </div>
    )
}
