let interval = 0
let currentScene: Scene

document.addEventListener("DOMContentLoaded", () => {
    currentScene = new SceneTitle()
})

type Scene = {}

document.addEventListener("contextmenu", (e) => {
    e.preventDefault()
})

const textCSS = {
    color: "azure",
    fontSize: "5vh",
    pointerEvents: "none",
    zIndex: "1000",
}

const oh = new Audio("maru.wav")

function wrapCharactersInSpan(element: HTMLElement, classPrefix = "char") {
    // テキストを取得
    const text = element.textContent ?? ""

    // 一文字ずつspanで囲む
    const wrappedText = text
        .split("")
        .map((char, index) => {
            // スペースの場合は&nbsp;を使用
            const content = char === " " ? "&nbsp;" : char
            return `<span class="${classPrefix}-${index}">${content}</span>`
        })
        .join("")

    // 元の要素の中身を置き換え
    element.innerHTML = wrappedText
}
