import PropTypes from "prop-types"
import React, { useRef, useState } from "react"

import styles from "./LanguageSelect.module.scss"

function Select({ options, value, onChange, menuStyles, SelectedItem, MenuItem }) {
    const [open, setOpen] = useState(false)
    const [search, setSearch] = useState("")
    const inputRef = useRef()

    const filterOptions = (options, q) => {
        return options.filter(({ label }) => label.toLowerCase().includes(q.toLowerCase()))
    }

    const onOpen = () => {
        inputRef.current.focus()
        setOpen(true)
    }

    const onSearch = e => {
        setSearch(e.target.value)
    }

    const onKeyDown = e => {
        if (e.key === "Escape") {
            setOpen(false)
            setSearch("")
            inputRef.current.blur()
        }
    }

    const onSelectOption = value => {
        setOpen(false)
        setSearch("")
        onChange(value)
    }

    const matchingOptions = search === "" ? options : filterOptions(options, search)

    return (
        <div className={styles.select}>
            <input
                type="text"
                ref={inputRef}
                value={search}
                onChange={onSearch}
                onFocus={onOpen}
                onBlur={() => setOpen(false)}
                onKeyDown={onKeyDown}
                onClick={onOpen}
            />
            <div className={`${styles.caret} ${open ? styles.active : ""}`} onClick={onOpen}>
                <span className="material-icons">expand_more</span>
            </div>
            {search === "" && (
                <div className={styles.value} onClick={onOpen}>
                    <SelectedItem options={options} value={value} />
                </div>
            )}
            <div style={{ ...menuStyles, display: open ? "block" : "none" }} className={styles.menu}>
                <div>
                    {matchingOptions.map(option => (
                        <div
                            key={option.value}
                            className={`${styles.option} ${option.value === value ? styles.selected : ""}`}
                            onMouseDown={() => onSelectOption(option.value)}
                        >
                            <MenuItem option={option} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

Select.propTypes = {}

export default function LanguageSelect({ languages, value, onChange, menuStyles }) {
    const options = Object.entries(languages.names).map(([code, name]) => ({
        value: code,
        label: name,
        icon: languages.icons[code]
    }))

    const SelectedItem = ({ options, value }) => {
        const { icon } = options.find(option => option.value === value)
        return <span style={{ fontSize: 22 }}>{icon}</span>
    }

    const MenuItem = ({ option }) => {
        return (
            <>
                <div>{option.label}</div>
                <div style={{ fontSize: 22 }}>{option.icon}</div>
            </>
        )
    }

    return (
        <Select
            options={options}
            value={value}
            onChange={onChange}
            menuStyles={menuStyles}
            SelectedItem={SelectedItem}
            MenuItem={MenuItem}
        />
    )
}

LanguageSelect.propTypes = {
    languages: PropTypes.object.isRequired,
    defaultValue: PropTypes.string.isRequired
}

export function ThemeSelect({ value, onChange, menuStyles }) {
    const themes = ["Purple", "Green", "Dark"]
    const options = themes.map(theme => ({
        value: theme.toLowerCase(),
        label: theme
    }))

    const SelectedItem = ({ options, value }) => {
        console.log(options, value)
        const { label } = options.find(option => option.value === value)
        return <span style={{ paddingTop: 5 }}>{label}</span>
    }

    const MenuItem = ({ option }) => {
        return option.label
    }

    return (
        <Select
            options={options}
            value={value}
            onChange={onChange}
            menuStyles={menuStyles}
            SelectedItem={SelectedItem}
            MenuItem={MenuItem}
        />
    )
}
