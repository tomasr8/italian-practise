import React from "react"
import NotFoundIcon from "./notfound.svg"

export default function NotFound() {
    return (
        <div style={{ marginTop: 30, marginBottom: 30, textAlign: "center" }}>
            <div style={{ height: 60 }}>
                <NotFoundIcon />
            </div>
            <div>Not found</div>
        </div>
    )
}
