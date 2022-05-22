import React, { useState, useContext } from "react"
import PropTypes from "prop-types"

import { setTab } from "./actions"
import TranslateIcon from "./icons/translate.svg"
import SearchIcon from "./icons/search.svg"
import SettingsIcon from "./icons/settings.svg"
import styles from "./Tabs.module.scss"

export default function Tabs({ tab, dispatch }) {
    return (
        <div className={styles.tabs}>
            <button
                className={`button button-clear ${tab === "translate" ? styles.selected : ""}`}
                onClick={() => dispatch(setTab("translate"))}
            >
                <span className={`material-icons-outlined ${styles.icon}`}>translate</span>
                <span className={styles["button-text"]}>Translate</span>
            </button>
            <button
                className={`button button-clear ${tab === "search" ? styles.selected : ""}`}
                onClick={() => dispatch(setTab("search"))}
            >
                <span className={`material-icons-outlined ${styles.icon}`}>search</span>
                <span className={styles["button-text"]}>Search</span>
            </button>
            <button
                className={`button button-clear ${tab === "settings" ? styles.selected : ""}`}
                onClick={() => dispatch(setTab("settings"))}
            >
                <span className="material-icons-outlined" style={{ fontSize: 20 }}>
                    settings
                </span>
            </button>
        </div>
    )
}

Tabs.propTypes = {
    tab: PropTypes.oneOf(["translate", "search", "settings"]).isRequired,
    setTab: PropTypes.func.isRequired
}
