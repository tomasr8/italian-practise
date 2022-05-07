const { createGzip } = require("node:zlib")
const { pipeline } = require("node:stream")
const fs = require("node:fs")
const { createReadStream, createWriteStream } = fs

function shuffle(array) {
    let currentIndex = array.length
    let randomIndex = 0

    while (currentIndex != 0) {
        randomIndex = Math.floor(Math.random() * currentIndex)
        currentIndex--
        ;[array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]]
    }
}

const MAX_PHRASE_LENGTH = 150
const MAX_DICTIONARY_SIZE = 50000
const pairs = [
    "en-it",
    "it-en",
    "en-fr",
    "fr-en",
    "en-cs",
    "cs-en",
    "it-fr",
    "fr-it",
    "it-cs",
    "cs-it",
    "fr-cs",
    "cs-fr"
]
const combined = {}

pairs.forEach(pair => {
    const data = fs.readFileSync(`${pair}.tsv`, "utf-8")
    const lines = data.trim().split("\n")
    const phrases = lines
        .map(line => {
            const [, original, , translated] = line.trim().split("\t")
            if(!original || !translated) {
                console.log("null", line, original, translated)
            }
            return { original, translated }
        })
        .filter(
            ({ original, translated }) => original.length < MAX_PHRASE_LENGTH && translated.length < MAX_PHRASE_LENGTH
        )

    shuffle(phrases)
    combined[pair] = phrases.slice(0, MAX_DICTIONARY_SIZE)
})

fs.writeFileSync("combined.json", JSON.stringify(combined), "utf-8")

const gzip = createGzip()
const source = createReadStream("combined.json")
const destination = createWriteStream("combined.json.gz")

pipeline(source, gzip, destination, err => {
    if (err) {
        console.error("Failed to gzip data:", err)
        process.exitCode = 1
    }
})
