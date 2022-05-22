import React, { useState, useContext, createContext } from "react"
import { normalize } from "./util"

export async function getTheme() {
    return browser.storage.local.get("theme").then(({ theme }) => theme)
}

export async function setTheme(theme) {
    return browser.storage.local.set({ theme })
}

export async function getRemoteLanguageMetadata() {
    return browser.storage.local
        .get("remoteLanguageMetadata")
        .then(({ remoteLanguageMetadata }) => remoteLanguageMetadata)
}

export async function setRemoteLanguageMetadata(remoteLanguageMetadata) {
    return browser.storage.local.set({ remoteLanguageMetadata })
}

export async function getLocalLanguageMetadata() {
    return browser.storage.local.get("localLanguageMetadata").then(({ localLanguageMetadata }) => localLanguageMetadata)
}

export async function setLocalLanguageMetadata(localLanguageMetadata) {
    console.log("PERSISTING", localLanguageMetadata)
    return browser.storage.local.set({ localLanguageMetadata })
}

export async function getLanguagePair(pair) {
    pair = normalize(pair)
    const key = `languagePairs.${pair}`
    return browser.storage.local.get(`languagePairs.${pair}`).then(data => data[key])
}

export async function setLanguagePair(pair, data) {
    pair = normalize(pair)
    const key = `languagePairs.${pair}`
    return browser.storage.local.set({ [key]: data })
}

export async function deleteLanguagePair(pair) {
    pair = normalize(pair)
    const key = `languagePairs.${pair}`
    return browser.storage.local.remove(key)
}
