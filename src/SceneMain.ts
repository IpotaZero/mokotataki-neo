const SceneMain = class {
    #scoreText: Itext
    #score = 0

    #frame: Ielement

    #block: Ielement

    #focusSound = new Audio("きらーん1.mp3")

    constructor() {
        this.#focusSound.volume = 0.3

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
        const sound = new Audio("カウントダウン電子音.mp3")
        sound.volume = 0.3

        const itext = new Itext(container, "3", {
            css: {
                ...textCSS,
                fontSize: "16vh",
            },
        })

        sound.play()

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

        await sleep(1300)

        itext.remove()
    }

    #clearContainer() {
        ;[...container.children].forEach((c) => c.remove())
        ;[...document.head.children].filter((c) => c.tagName == "STYLE").forEach((c) => c.remove())
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
        const drum = new Audio("ドラムロール.mp3")
        drum.volume = 0.5
        const cymbal = this.#score < 10 ? new Audio("間抜け7.mp3") : new Audio("ロールの締め.mp3")

        const result = new Itext(container, `結果...`, {
            css: {
                ...textCSS,
                fontSize: "6vh",
                top: "30%",
            },
        })

        drum.currentTime = 2

        await drum.play()

        await new Promise((resolve) => {
            drum.onended = resolve
        })

        const shadowColor =
            ["", "lightGreen", "red", "rgba(240, 198, 16, 1)", "blue"][Math.floor(this.#score / 10)] ?? "Gold"

        const css: any =
            this.#score >= 40
                ? {
                      background:
                          "linear-gradient(to right, #e60000, #f39800, #fff100, #009944,rgb(0, 180, 183),rgb(73, 77, 173),rgb(177, 49, 164))",
                      webkitTextFillColor: "transparent",
                      backgroundClip: "text",
                      textShadow: `0px 0px 12px #f2ffff30`,
                  }
                : {
                      textShadow: `0px 0px 10px ${shadowColor}`,
                  }

        const score = new Itext(container, `${this.#score}匹${"!".repeat(this.#score / 10)}`, {
            css: {
                ...textCSS,
                fontSize: "10vh",
                ...css,
            },
        })

        cymbal.play()

        await score.ready

        const back = new Itext(container, `戻る`, {
            css: {
                width: "20%",
                height: "10%",
                top: "60%",

                borderRadius: "5%",

                ...textCSS,

                pointerEvents: "",

                backgroundColor: "rgba(0, 0, 0, 0.3)",

                ":hover": {
                    border: "azure 0.3vh solid",
                    cursor: "pointer",
                },
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

                backgroundImage: "url(mokota.png)",
                backgroundSize: "contain",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
            },
        })

        this.#block.onclick = () => {
            oh.currentTime = 0
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
            this.#frame.style.boxShadow = "inset 0px 0px 8vh 2vh rgba(255, 255, 255, 0.2)"
        } else if (this.#score == 20) {
            this.#frame.style.boxShadow = "inset 0px 0px 12vh 2vh rgba(255, 255, 255, 0.2)"
        } else if (this.#score == 30) {
            this.#frame.style.boxShadow = "inset 0px 0px 16vh 2vh rgba(255, 255, 255, 0.2)"
        }
    }
}
