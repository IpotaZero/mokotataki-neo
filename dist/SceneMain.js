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
var _SceneMain_instances, _SceneMain_scoreText, _SceneMain_score, _SceneMain_frame, _SceneMain_block, _SceneMain_img, _SceneMain_focus, _SceneMain_focusSound, _SceneMain_startGame, _SceneMain_countdown, _SceneMain_clearContainer, _SceneMain_setupScoreText, _SceneMain_setupTimeLoop, _SceneMain_displayResult, _SceneMain_createBlock, _SceneMain_shakeContainer, _SceneMain_updateScore;
class SceneMain {
    constructor() {
        _SceneMain_instances.add(this);
        _SceneMain_scoreText.set(this, void 0);
        _SceneMain_score.set(this, 0);
        _SceneMain_frame.set(this, void 0);
        _SceneMain_block.set(this, void 0);
        _SceneMain_img.set(this, new Image());
        _SceneMain_focus.set(this, new Image());
        _SceneMain_focusSound.set(this, new Audio("きらーん1.mp3"));
        __classPrivateFieldGet(this, _SceneMain_img, "f").src = "mokota.png";
        __classPrivateFieldGet(this, _SceneMain_focus, "f").src = "im11277821.png";
        __classPrivateFieldGet(this, _SceneMain_focus, "f").classList.add("focus");
        __classPrivateFieldGet(this, _SceneMain_instances, "m", _SceneMain_clearContainer).call(this);
        __classPrivateFieldSet(this, _SceneMain_frame, new Ielement(container, {
            css: {
                width: "100%",
                height: "100%",
            },
        }), "f");
        __classPrivateFieldGet(this, _SceneMain_instances, "m", _SceneMain_setupScoreText).call(this);
        __classPrivateFieldGet(this, _SceneMain_instances, "m", _SceneMain_startGame).call(this);
    }
}
_SceneMain_scoreText = new WeakMap(), _SceneMain_score = new WeakMap(), _SceneMain_frame = new WeakMap(), _SceneMain_block = new WeakMap(), _SceneMain_img = new WeakMap(), _SceneMain_focus = new WeakMap(), _SceneMain_focusSound = new WeakMap(), _SceneMain_instances = new WeakSet(), _SceneMain_startGame = async function _SceneMain_startGame() {
    await __classPrivateFieldGet(this, _SceneMain_instances, "m", _SceneMain_countdown).call(this);
    __classPrivateFieldGet(this, _SceneMain_instances, "m", _SceneMain_setupTimeLoop).call(this);
    __classPrivateFieldGet(this, _SceneMain_instances, "m", _SceneMain_createBlock).call(this);
}, _SceneMain_countdown = async function _SceneMain_countdown() {
    const itext = new Itext(container, "3", {
        css: {
            ...textCSS,
            fontSize: "16vh",
        },
    });
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
    await sleep(1000);
    itext.remove();
}, _SceneMain_clearContainer = function _SceneMain_clearContainer() {
    ;
    [...container.children].forEach((c) => c.remove());
}, _SceneMain_setupScoreText = function _SceneMain_setupScoreText() {
    __classPrivateFieldSet(this, _SceneMain_scoreText, new Itext(container, "", {
        css: {
            left: "5%",
            top: "5%",
            ...textCSS,
        },
    }), "f");
}, _SceneMain_setupTimeLoop = function _SceneMain_setupTimeLoop() {
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
            __classPrivateFieldGet(this, _SceneMain_instances, "m", _SceneMain_displayResult).call(this);
            __classPrivateFieldGet(this, _SceneMain_block, "f").remove();
            return;
        }
        requestAnimationFrame(timeLoop);
    };
    requestAnimationFrame(timeLoop);
}, _SceneMain_displayResult = async function _SceneMain_displayResult() {
    const score = new Itext(container, `結果: ${__classPrivateFieldGet(this, _SceneMain_score, "f")}匹`, {
        css: {
            ...textCSS,
        },
    });
    await score.ready;
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
    });
    back.onclick = () => {
        currentScene = new SceneTitle();
    };
}, _SceneMain_createBlock = function _SceneMain_createBlock() {
    // ランダムな位置に配置
    const randomX = Math.random() * 80; // 80%以内
    const randomY = Math.random() * 80; // 80%以内
    __classPrivateFieldSet(this, _SceneMain_block, new Ielement(container, {
        css: {
            position: "absolute",
            left: `${randomX}%`,
            top: `${randomY}%`,
            width: "15%",
            aspectRatio: "1",
            cursor: "pointer",
        },
    }), "f");
    __classPrivateFieldGet(this, _SceneMain_block, "f").appendChild(__classPrivateFieldGet(this, _SceneMain_img, "f"));
    __classPrivateFieldGet(this, _SceneMain_block, "f").onclick = () => {
        oh.play();
        const { top, left } = __classPrivateFieldGet(this, _SceneMain_block, "f").getClientRects()[0];
        const { x, y } = container.getClientRects()[0];
        __classPrivateFieldGet(this, _SceneMain_block, "f").remove();
        __classPrivateFieldGet(this, _SceneMain_instances, "m", _SceneMain_updateScore).call(this, top - y, left - x);
        __classPrivateFieldGet(this, _SceneMain_instances, "m", _SceneMain_createBlock).call(this);
        __classPrivateFieldGet(this, _SceneMain_instances, "m", _SceneMain_shakeContainer).call(this);
    };
}, _SceneMain_shakeContainer = function _SceneMain_shakeContainer() {
    container.classList.add("shake");
    // アニメーション終了後にクラスを削除
    container.addEventListener("animationend", () => {
        container.classList.remove("shake");
    }, { once: true }); // 一度だけリスナーを実行
}, _SceneMain_updateScore = function _SceneMain_updateScore(top, left) {
    var _a;
    __classPrivateFieldSet(this, _SceneMain_score, (_a = __classPrivateFieldGet(this, _SceneMain_score, "f"), _a++, _a), "f");
    __classPrivateFieldGet(this, _SceneMain_scoreText, "f").innerText = __classPrivateFieldGet(this, _SceneMain_score, "f") + "HIT!";
    __classPrivateFieldGet(this, _SceneMain_scoreText, "f").style.top = top + "px";
    __classPrivateFieldGet(this, _SceneMain_scoreText, "f").style.left = left + "px";
    __classPrivateFieldGet(this, _SceneMain_scoreText, "f").classList.remove("fadeout");
    requestAnimationFrame(() => {
        __classPrivateFieldGet(this, _SceneMain_scoreText, "f").classList.add("fadeout");
    });
    if (__classPrivateFieldGet(this, _SceneMain_score, "f") % 10 == 0) {
        __classPrivateFieldGet(this, _SceneMain_focusSound, "f").play();
    }
    if (__classPrivateFieldGet(this, _SceneMain_score, "f") == 10) {
        __classPrivateFieldGet(this, _SceneMain_frame, "f").style.boxShadow = "inset 0px 0px 8vh 2vh rgba(255, 255, 255, 0.3)";
    }
    else if (__classPrivateFieldGet(this, _SceneMain_score, "f") == 20) {
        __classPrivateFieldGet(this, _SceneMain_frame, "f").style.boxShadow = "inset 0px 0px 12vh 4vh rgba(255, 255, 255, 0.3)";
    }
    else if (__classPrivateFieldGet(this, _SceneMain_score, "f") == 30) {
        // this.#frame.appendChild(this.#focus)
    }
};
const container = document.getElementById("container");
if (!container)
    throw new Error("no container");
