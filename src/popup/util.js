export function normalize(pair) {
    const [source, target] = pair.split("-")
    return source < target ? pair : `${target}-${source}`
}
