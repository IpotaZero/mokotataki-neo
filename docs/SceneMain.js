"use strict";
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var _instances, _scoreText, _score, _frame, _block, _focusSound, _startGame, _countdown, _clearContainer, _setupScoreText, _setupTimeLoop, _displayResult, _createBlock, _shakeContainer, _updateScore, _a;
const SceneMain = (_a = class {
        constructor() {
            _instances.add(this);
            _scoreText.set(this, void 0);
            _score.set(this, 0);
            _frame.set(this, void 0);
            _block.set(this, void 0);
            _focusSound.set(this, new Audio("きらーん1.mp3"));
            __classPrivateFieldGet(this, _focusSound, "f").volume = 0.3;
            __classPrivateFieldGet(this, _instances, "m", _clearContainer).call(this);
            __classPrivateFieldSet(this, _frame, new Ielement(container, {
                css: {
                    width: "100%",
                    height: "100%",
                },
            }), "f");
            __classPrivateFieldGet(this, _instances, "m", _setupScoreText).call(this);
            __classPrivateFieldGet(this, _instances, "m", _startGame).call(this);
        }
    },
    _scoreText = new WeakMap(),
    _score = new WeakMap(),
    _frame = new WeakMap(),
    _block = new WeakMap(),
    _focusSound = new WeakMap(),
    _instances = new WeakSet(),
    _startGame = async function _startGame() {
        await __classPrivateFieldGet(this, _instances, "m", _countdown).call(this);
        __classPrivateFieldGet(this, _instances, "m", _setupTimeLoop).call(this);
        __classPrivateFieldGet(this, _instances, "m", _createBlock).call(this);
    },
    _countdown = async function _countdown() {
        const sound = new Audio("カウントダウン電子音.mp3");
        sound.volume = 0.3;
        const itext = new Itext(container, "3", {
            css: {
                ...textCSS,
                fontSize: "16vh",
            },
        });
        sound.play();
        itext.classList.add("fadeout");
        await sleep(1000);
        itext.innerText = "2";
        itext.classList.remove("fadeout");
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                itext.classList.add("fadeout");
            });
        });
        await sleep(1000);
        itext.innerText = "1";
        itext.classList.remove("fadeout");
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                itext.classList.add("fadeout");
            });
        });
        await sleep(1000);
        itext.innerText = "GO!";
        itext.classList.add("rolling");
        await sleep(1300);
        itext.remove();
    },
    _clearContainer = function _clearContainer() {
        ;
        [...container.children].forEach((c) => c.remove());
        [...document.head.children].filter((c) => c.tagName == "STYLE").forEach((c) => c.remove());
    },
    _setupScoreText = function _setupScoreText() {
        __classPrivateFieldSet(this, _scoreText, new Itext(container, "", {
            css: {
                left: "5%",
                top: "5%",
                ...textCSS,
            },
        }), "f");
    },
    _setupTimeLoop = function _setupTimeLoop() {
        const deadLine = 20;
        const timeText = new Itext(container, `Time: ${deadLine}`, {
            css: {
                top: "5%",
                right: "5%",
                ...textCSS,
            },
        });
        const startTime = Date.now();
        const timeLoop = () => {
            const duration = Date.now() - startTime;
            timeText.innerHTML = `Time: ${Math.max(Math.floor((1 + deadLine - duration / 1000) * 10 - 9) / 10, 0).toFixed(1)}`;
            if (duration > deadLine * 1000) {
                __classPrivateFieldGet(this, _instances, "m", _displayResult).call(this);
                __classPrivateFieldGet(this, _block, "f").remove();
                return;
            }
            requestAnimationFrame(timeLoop);
        };
        requestAnimationFrame(timeLoop);
    },
    _displayResult = async function _displayResult() {
        const drum = new Audio("ドラムロール.mp3");
        drum.volume = 0.5;
        const cymbal = __classPrivateFieldGet(this, _score, "f") < 10 ? new Audio("間抜け7.mp3") : new Audio("ロールの締め.mp3");
        const result = new Itext(container, `結果...`, {
            css: {
                ...textCSS,
                fontSize: "6vh",
                top: "30%",
            },
        });
        drum.currentTime = 2;
        await drum.play();
        await new Promise((resolve) => {
            drum.onended = resolve;
        });
        const shadowColor = ["", "lightGreen", "red", "rgba(240, 198, 16, 1)", "blue"][Math.floor(__classPrivateFieldGet(this, _score, "f") / 10)] ?? "Gold";
        const css = __classPrivateFieldGet(this, _score, "f") >= 40
            ? {
                background: "linear-gradient(to right, #e60000, #f39800, #fff100, #009944,rgb(0, 180, 183),rgb(73, 77, 173),rgb(177, 49, 164))",
                webkitTextFillColor: "transparent",
                backgroundClip: "text",
                textShadow: `0px 0px 12px #f2ffff30`,
            }
            : {
                textShadow: `0px 0px 10px ${shadowColor}`,
            };
        const score = new Itext(container, `${__classPrivateFieldGet(this, _score, "f")}匹${"!".repeat(__classPrivateFieldGet(this, _score, "f") / 10)}`, {
            css: {
                ...textCSS,
                fontSize: "10vh",
                ...css,
            },
        });
        cymbal.play();
        await score.ready;
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
        });
        back.onclick = () => {
            currentScene = new SceneTitle();
        };
    },
    _createBlock = function _createBlock() {
        // ランダムな位置に配置
        const randomX = Math.random() * 80; // 80%以内
        const randomY = Math.random() * 80; // 80%以内
        __classPrivateFieldSet(this, _block, new Ielement(container, {
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
        }), "f");
        __classPrivateFieldGet(this, _block, "f").onclick = () => {
            oh.currentTime = 0;
            oh.play();
            const { top, left } = __classPrivateFieldGet(this, _block, "f").getClientRects()[0];
            const { x, y } = container.getClientRects()[0];
            __classPrivateFieldGet(this, _block, "f").remove();
            __classPrivateFieldGet(this, _instances, "m", _updateScore).call(this, top - y, left - x);
            __classPrivateFieldGet(this, _instances, "m", _createBlock).call(this);
            __classPrivateFieldGet(this, _instances, "m", _shakeContainer).call(this);
        };
    },
    _shakeContainer = function _shakeContainer() {
        container.classList.add("shake");
        // アニメーション終了後にクラスを削除
        container.addEventListener("animationend", () => {
            container.classList.remove("shake");
        }, { once: true }); // 一度だけリスナーを実行
    },
    _updateScore = function _updateScore(top, left) {
        var _b;
        __classPrivateFieldSet(this, _score, (_b = __classPrivateFieldGet(this, _score, "f"), _b++, _b), "f");
        __classPrivateFieldGet(this, _scoreText, "f").innerText = __classPrivateFieldGet(this, _score, "f") + "HIT!";
        __classPrivateFieldGet(this, _scoreText, "f").style.top = top + "px";
        __classPrivateFieldGet(this, _scoreText, "f").style.left = left + "px";
        __classPrivateFieldGet(this, _scoreText, "f").classList.remove("fadeout");
        requestAnimationFrame(() => {
            __classPrivateFieldGet(this, _scoreText, "f").classList.add("fadeout");
        });
        if (__classPrivateFieldGet(this, _score, "f") % 10 == 0) {
            __classPrivateFieldGet(this, _focusSound, "f").play();
        }
        if (__classPrivateFieldGet(this, _score, "f") == 10) {
            __classPrivateFieldGet(this, _frame, "f").style.boxShadow = "inset 0px 0px 8vh 2vh rgba(255, 255, 255, 0.2)";
        }
        else if (__classPrivateFieldGet(this, _score, "f") == 20) {
            __classPrivateFieldGet(this, _frame, "f").style.boxShadow = "inset 0px 0px 12vh 2vh rgba(255, 255, 255, 0.2)";
        }
        else if (__classPrivateFieldGet(this, _score, "f") == 30) {
            __classPrivateFieldGet(this, _frame, "f").style.boxShadow = "inset 0px 0px 16vh 2vh rgba(255, 255, 255, 0.2)";
        }
    },
    _a);
//# sourceMappingURL=SceneMain.js.map