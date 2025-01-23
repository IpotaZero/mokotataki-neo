"use strict";
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _SceneTitle_instances, _SceneTitle_clearContainer, _SceneTitle_setupTitle, _SceneTitle_setupCommand, _a;
const SceneTitle = (_a = class {
        constructor() {
            _SceneTitle_instances.add(this);
            __classPrivateFieldGet(this, _SceneTitle_instances, "m", _SceneTitle_clearContainer).call(this);
            __classPrivateFieldGet(this, _SceneTitle_instances, "m", _SceneTitle_setupTitle).call(this);
            __classPrivateFieldGet(this, _SceneTitle_instances, "m", _SceneTitle_setupCommand).call(this);
        }
    },
    _SceneTitle_instances = new WeakSet(),
    _SceneTitle_clearContainer = function _SceneTitle_clearContainer() {
        ;
        [...container.children].forEach((c) => c.remove());
        [...document.head.children].filter((c) => c.tagName == "STYLE").forEach((c) => c.remove());
    },
    _SceneTitle_setupTitle = function _SceneTitle_setupTitle() {
        const title = new Itext(container, "もこたたき::NEO!", {
            css: {
                top: "15%",
                width: "100%",
                flexDirection: "row",
                color: "azure",
                fontSize: "12vh",
                zIndex: "1000",
                textShadow: "0px 0px 10px rgba(240, 198, 16, 1)",
            },
        });
        title.ready.then(() => {
            wrapCharactersInSpan(title);
            [...title.children].forEach((c) => {
                c.classList.add("wave");
            });
        });
        for (let i = 0; i < 11; i++) {
            const style = document.createElement("style");
            style.innerHTML = `
                .char-${i}{
                    animation-delay: ${i * 100}ms
                }
            `;
            document.head.appendChild(style);
        }
    },
    _SceneTitle_setupCommand = function _SceneTitle_setupCommand() {
        const icommand = new Icommand(container, new Idict({ "": ["はじめる", "せつめい", "くれじっと"] }), {
            css: {
                top: "65%",
                width: "30%",
                height: "30%",
                borderRadius: "5px",
                display: "block",
                textAlign: "center",
                // border: "azure 2px solid",
                " .i-command-option": {
                    ...textCSS,
                    position: "relative",
                    width: "100%",
                    height: "30%",
                    pointerEvents: "",
                    cursor: "pointer",
                    backgroundColor: "rgba(0, 0, 0, 0.3)",
                    borderRadius: "5px",
                    ":hover": {
                        border: "azure 0.3vh solid",
                    },
                },
            },
        });
        icommand.on("0", () => {
            currentScene = new SceneMain();
        });
        icommand.on("1", async () => {
            const title = new Itext(container, "せつめい", {
                css: {
                    ...textCSS,
                    top: "40%",
                    left: "10%",
                },
            });
            await title.ready;
            const itext = new Itext(container, `
                    20秒間でできるだけ多く↓もこたをクリックしよう!<br>
                    もこたは瞬間移動します
                `, {
                speed: 48,
                css: {
                    ...textCSS,
                    top: "50%",
                    fontSize: "4vh",
                    display: "inline",
                    textAlign: "left",
                    width: "100%",
                    paddingLeft: "10%",
                },
            });
            const img = new Ielement(container, {
                css: {
                    top: "65%",
                    width: "15%",
                    aspectRatio: "1",
                    backgroundColor: "azure",
                    backgroundImage: "url(mokota.png)",
                    backgroundSize: "contain",
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "center",
                    border: "azure 0.3vh solid",
                    borderRadius: "10%",
                    ":hover": {
                        cursor: "pointer",
                    },
                },
            });
            img.onclick = () => {
                oh.play();
            };
            const back = new Itext(container, "戻る", {
                css: {
                    ...textCSS,
                    top: "90%",
                    pointerEvents: "",
                    borderRadius: "5%",
                    width: "20%",
                    height: "8%",
                    ":hover": {
                        border: "azure 0.3vh solid",
                        cursor: "pointer",
                    },
                },
            });
            back.onclick = () => {
                title.remove();
                itext.remove();
                back.remove();
                img.remove();
                icommand.cancel(1);
            };
        });
        icommand.on("2", async () => {
            const itext = new Itext(container, "credit.html", {
                speed: 200,
                css: {
                    ...textCSS,
                    top: "30%",
                    fontSize: "4vh",
                    display: "inline",
                    textAlign: "left",
                    width: "100%",
                    paddingLeft: "10%",
                    pointerEvents: "",
                },
            });
            const back = new Itext(container, "戻る", {
                css: {
                    ...textCSS,
                    top: "90%",
                    pointerEvents: "",
                    borderRadius: "5%",
                    width: "20%",
                    height: "8%",
                    ":hover": {
                        border: "azure 0.3vh solid",
                        cursor: "pointer",
                    },
                },
            });
            back.onclick = () => {
                itext.remove();
                back.remove();
                icommand.cancel(1);
            };
        });
    },
    _a);
//# sourceMappingURL=SceneTitle.js.map