import notfound from "./notfound.svg"

export default function createNotfound() {
    const parser = new DOMParser()
    return parser.parseFromString(
        `<div class="not-found">
            <div>${notfound}</div>
            <div>Not found</div>
        </div>`,
        "text/html"
    ).body.childNodes[0]
}
