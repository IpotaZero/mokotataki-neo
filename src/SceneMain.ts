class SceneMain {
    #scoreText: Itext
    #score = 0

    #frame: Ielement

    #block: Ielement

    #img = new Image()

    #focus = new Image()

    #focusSound = new Audio("きらーん1.mp3")

    constructor() {
        this.#img.src = "mokota.png"
        this.#focus.src = "im11277821.png"
        this.#focus.classList.add("focus")

        this.#clearContainer()

        this.#frame = new Ielement(container, {
            css: {
                width: "100%",
                height: "100%",
            },
        })

        this.#setupScoreText()

        this.#startGame()
    }

    async #startGame() {
        await this.#countdown()

        this.#setupTimeLoop()

        this.#createBlock()
    }

    async #countdown() {
        const itext = new Itext(container, "3", {
            css: {
                ...textCSS,
                fontSize: "16vh",
            },
        })

        itext.classList.add("fadeout")

        await sleep(1000)
        itext.innerText = "2"
        itext.classList.remove("fadeout")
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                itext.classList.add("fadeout")
            })
        })

        await sleep(1000)
        itext.innerText = "1"
        itext.classList.remove("fadeout")
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                itext.classList.add("fadeout")
            })
        })

        await sleep(1000)
        itext.innerText = "GO!"
        itext.classList.add("rolling")

        await sleep(1000)

        itext.remove()
    }

    #clearContainer() {
        ;[...container.children].forEach((c) => c.remove())
    }

    #setupScoreText() {
        this.#scoreText = new Itext(container, "", {
            css: {
                left: "5%",
                top: "5%",
                ...textCSS,
            },
        })
    }

    #setupTimeLoop() {
        const deadLine = 20

        const timeText = new Itext(container, `Time: ${deadLine}`, {
            css: {
                top: "5%",
                right: "5%",
                ...textCSS,
            },
        })

        const startTime = Date.now()

        const timeLoop = () => {
            const duration = Date.now() - startTime

            timeText.innerHTML = `Time: ${Math.max(
                Math.floor((1 + deadLine - duration / 1000) * 10 - 9) / 10,
                0,
            ).toFixed(1)}`

            if (duration > deadLine * 1000) {
                this.#displayResult()
                this.#block.remove()
                return
            }

            requestAnimationFrame(timeLoop)
        }

        requestAnimationFrame(timeLoop)
    }

    async #displayResult() {
        const score = new Itext(container, `結果: ${this.#score}匹`, {
            css: {
                ...textCSS,
            },
        })

        await score.ready

        const back = new Itext(container, `戻る`, {
            css: {
                width: "20%",
                height: "10%",
                top: "60%",

                borderRadius: "5%",

                ...textCSS,

                pointerEvents: "",
            },
            hoverCss: {
                border: "azure 0.3vh solid",
                cursor: "pointer",
            },
        })

        back.onclick = () => {
            currentScene = new SceneTitle()
        }
    }

    #createBlock() {
        // ランダムな位置に配置
        const randomX = Math.random() * 80 // 80%以内
        const randomY = Math.random() * 80 // 80%以内

        this.#block = new Ielement(container, {
            css: {
                position: "absolute",
                left: `${randomX}%`,
                top: `${randomY}%`,

                width: "15%",
                aspectRatio: "1",

                cursor: "pointer",
            },
        })

        this.#block.appendChild(this.#img)

        this.#block.onclick = () => {
            oh.play()

            const { top, left } = this.#block.getClientRects()[0]
            const { x, y } = container.getClientRects()[0]

            this.#block.remove()
            this.#updateScore(top - y, left - x)
            this.#createBlock()
            this.#shakeContainer()
        }
    }

    #shakeContainer() {
        container.classList.add("shake")

        // アニメーション終了後にクラスを削除
        container.addEventListener(
            "animationend",
            () => {
                container.classList.remove("shake")
            },
            { once: true },
        ) // 一度だけリスナーを実行
    }

    #updateScore(top: number, left: number) {
        this.#score++
        this.#scoreText.innerText = this.#score + "HIT!"
        this.#scoreText.style.top = top + "px"
        this.#scoreText.style.left = left + "px"

        this.#scoreText.classList.remove("fadeout")
        requestAnimationFrame(() => {
            this.#scoreText.classList.add("fadeout")
        })

        if (this.#score % 10 == 0) {
            this.#focusSound.play()
        }

        if (this.#score == 10) {
            this.#frame.style.boxShadow = "inset 0px 0px 8vh 2vh rgba(255, 255, 255, 0.3)"
        } else if (this.#score == 20) {
            this.#frame.style.boxShadow = "inset 0px 0px 12vh 4vh rgba(255, 255, 255, 0.3)"
        } else if (this.#score == 30) {
            // this.#frame.appendChild(this.#focus)
        }
    }
}

const container = document.getElementById("container") as HTMLDivElement
if (!container) throw new Error("no container")
