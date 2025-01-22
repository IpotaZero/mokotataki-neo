class Ielement extends HTMLDivElement {
    static idCount = 0

    #styleElement = document.createElement("style")

    constructor(
        container: HTMLElement,
        {
            css = {},
            hoverCss = {},
        }: {
            css?: Partial<CSSStyleDeclaration>
            hoverCss?: Partial<CSSStyleDeclaration>
        } = {},
    ) {
        super()
        this.setCSS(css, hoverCss)

        container.appendChild(this)
    }

    setCSS(css: any, hoverCss: any) {
        // ユニークなクラス名を生成
        const uniqueClass = `i-element-${Ielement.idCount++}`
        this.classList.add(uniqueClass)

        // キャメルケースをケバブケースに変換する関数
        const toKebabCase = (str: string) => {
            let s = str.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase()

            if (s.startsWith("webkit")) s = "-" + s

            return s
        }

        this.#styleElement.textContent = `
            .${uniqueClass} {
                ${Object.entries(css)
                    .map(([key, value]) => `${toKebabCase(key)}: ${value};`)
                    .join("\n")}
            }
            
            .${uniqueClass}:hover {
                ${Object.entries(hoverCss)
                    .map(([key, value]) => `${toKebabCase(key)}: ${value};`)
                    .join("\n")}
            }
        `

        document.head.appendChild(this.#styleElement)
    }

    remove(): void {
        super.remove()
        this.#styleElement.remove()
    }
}

customElements.define("i-element", Ielement, { extends: "div" })

class Itext extends Ielement {
    #interval = 0
    #tempDiv = document.createElement("div")
    #originalHTML: string
    isEnd = false
    ready: Promise<void>

    constructor(
        container: HTMLElement,
        text: string,
        {
            css = {},
            hoverCss = {},
            speed = 24,
        }: {
            css?: Partial<CSSStyleDeclaration>
            hoverCss?: Partial<CSSStyleDeclaration>
            speed?: number
        } = {},
    ) {
        super(container, { css, hoverCss })

        // 元のHTMLを保存
        this.#originalHTML = text.replace(/\s{2,}/g, " ").replace(/\n/g, "")
        this.#tempDiv.innerHTML = this.#originalHTML

        // 表示用の要素を初期化
        this.innerHTML = this.#originalHTML
        this.#processTextNodes(this)

        this.ready = new Promise((resolve) => {
            // アニメーション開始
            this.#interval = setInterval(() => {
                this.#updateText(resolve)
            }, 1000 / speed)
        })
    }

    // テキストノードを再帰的に処理
    #processTextNodes(element: HTMLElement) {
        const childNodes = Array.from(element.childNodes)

        childNodes.forEach((node) => {
            if (node.nodeType === Node.TEXT_NODE) {
                const text = node.textContent?.trim()
                if (text) {
                    // テキストノードをspanで置き換え
                    const span = document.createElement("span")
                    span.setAttribute("data-original", text)
                    span.textContent = ""
                    node.parentNode?.replaceChild(span, node)
                }
            } else if (node.nodeType === Node.ELEMENT_NODE) {
                // 要素ノードの場合は、その子要素も処理
                this.#processTextNodes(node as HTMLElement)

                const elem = node as HTMLElement
                // ルビ要素の場合は特別な属性を設定
                if (elem.tagName.toLowerCase() === "rt") {
                    elem.querySelectorAll("span[data-original]").forEach((span) => {
                        span.setAttribute("data-ruby", "true")
                    })
                }
            }
        })
    }

    #updateText(resolve: Function) {
        const spans = Array.from(this.getElementsByTagName("span")).filter(
            (span) =>
                span.hasAttribute("data-original") &&
                span.textContent!.length < span.getAttribute("data-original")!.length,
        )

        if (spans.length === 0) {
            clearInterval(this.#interval)
            this.innerHTML = this.#originalHTML
            this.isEnd = true

            resolve()
            return
        }

        // メインのテキストを取得（ルビ以外）
        const mainSpan = spans.find((span) => !span.hasAttribute("data-ruby"))

        if (mainSpan) {
            const originalText = mainSpan.getAttribute("data-original")!
            const currentLength = mainSpan.textContent!.length
            mainSpan.textContent = originalText.substring(0, currentLength + 1)

            // ルビ元の文字が表示されたかチェック
            const rubyBase = mainSpan.closest("ruby")
            if (rubyBase) {
                const rt = rubyBase.querySelector("rt")
                if (rt && rt.querySelector("span[data-original]")) {
                    const rtSpan = rt.querySelector("span[data-original]")!
                    const originalRuby = rtSpan.getAttribute("data-original")!

                    rtSpan.textContent = originalRuby.substring(
                        0,
                        ((currentLength + 1) / originalText.length) * originalRuby.length,
                    )
                }
            }
        }
    }

    // アニメーションを即座に完了
    finish() {
        clearInterval(this.#interval)
        this.innerHTML = this.#originalHTML
        this.isEnd = true
        this.ready = Promise.resolve()
    }
}

customElements.define("i-text", Itext, { extends: "div" })

class Icommand extends Ielement {
    #handlerDict = new Idict<() => void>({})
    #optionDict = new Idict<string[]>({})
    #branch = ""
    #option

    constructor(
        container: HTMLElement,
        dict: Idict<string[]>,
        option: {
            text?: {
                css?: Partial<CSSStyleDeclaration>
                hoverCss?: Partial<CSSStyleDeclaration>
            }
            command?: {
                css?: Partial<CSSStyleDeclaration>
                hoverCss?: Partial<CSSStyleDeclaration>
            }
            speed?: number
        } = {},
    ) {
        super(container, { css: option.command?.css, hoverCss: option.command?.hoverCss })

        this.#option = option
        this.#optionDict = dict

        this.#setOptions()
    }

    async #setOptions() {
        const optionList = this.#optionDict.get(this.#branch)

        ;[...this.children].forEach((n) => {
            n.remove()
        })

        if (!optionList) return

        for (const [i, option] of optionList.entries()) {
            const itext = new Itext(this, option, this.#option.text)
            itext.onclick = () => {
                this.#onclickOption(i)
            }

            await itext.ready
        }
    }

    #onclickOption(i: number) {
        this.#branch += i
        this.#setOptions()

        this.#handlerDict.get(this.#branch)?.()
    }

    cancel(depth: number) {
        for (let i = 0; i < depth; i++) {
            if (this.#branch == "") break
            this.#branch = this.#branch.substring(0, -1)
        }

        this.#setOptions()
    }

    on(regex: string, handler: () => void) {
        this.#handlerDict.dict[regex] = handler

        return this
    }
}

customElements.define("i-command", Icommand, { extends: "div" })

const sleep = (ms: number): Promise<void> =>
    new Promise((resolve) => {
        setTimeout(() => {
            resolve()
        }, ms)
    })
