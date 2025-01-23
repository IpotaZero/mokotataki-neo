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
var _Ielement_instances, _a, _Ielement_idCount, _Ielement_toKebabCase, _Ielement_styleElement, _Ielement_setCSS, _Ielement_createStyleString, _Itext_instances, _Itext_interval, _Itext_tempDiv, _Itext_originalHTML, _Itext_setupText, _Itext_processTextNodes, _Itext_updateText, _Icommand_instances, _Icommand_handlerDict, _Icommand_optionDict, _Icommand_branch, _Icommand_options, _Icommand_setOptions, _Icommand_onclickOption;
class Ielement extends HTMLDivElement {
    constructor(container, options = {}) {
        super();
        _Ielement_instances.add(this);
        _Ielement_styleElement.set(this, document.createElement("style"));
        __classPrivateFieldGet(this, _Ielement_instances, "m", _Ielement_setCSS).call(this, options.css);
        container.appendChild(this);
    }
    remove() {
        super.remove();
        __classPrivateFieldGet(this, _Ielement_styleElement, "f").remove();
    }
}
_a = Ielement, _Ielement_styleElement = new WeakMap(), _Ielement_instances = new WeakSet(), _Ielement_toKebabCase = function _Ielement_toKebabCase(str) {
    let s = str.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
    if (s.startsWith("webkit"))
        s = "-" + s;
    return s;
}, _Ielement_setCSS = function _Ielement_setCSS(css) {
    var _b, _c, _d;
    // ユニークなクラス名を生成
    const uniqueClass = `i-element-${__classPrivateFieldSet(_b = _a, _a, (_d = __classPrivateFieldGet(_b, _a, "f", _Ielement_idCount), _c = _d++, _d), "f", _Ielement_idCount), _c}`;
    this.classList.add(uniqueClass);
    if (css) {
        let style = `.${uniqueClass} {\n`;
        style += __classPrivateFieldGet(this, _Ielement_instances, "m", _Ielement_createStyleString).call(this, 1, css);
        __classPrivateFieldGet(this, _Ielement_styleElement, "f").textContent = style + "}";
        document.head.appendChild(__classPrivateFieldGet(this, _Ielement_styleElement, "f"));
    }
}, _Ielement_createStyleString = function _Ielement_createStyleString(depth, css) {
    let style = "";
    Object.entries(css).forEach(([property, value], i, list) => {
        if (typeof value == "string") {
            style += " ".repeat(4 * depth) + `${__classPrivateFieldGet(this, _Ielement_instances, "m", _Ielement_toKebabCase).call(this, property)}: ${value};`;
            if (i != list.length - 1)
                style += "\n";
            return;
        }
        style +=
            "\n" +
                " ".repeat(4 * depth) +
                `&${property} {\n${__classPrivateFieldGet(this, _Ielement_instances, "m", _Ielement_createStyleString).call(this, depth + 1, value)}` +
                "\t".repeat(depth) +
                `}`;
    });
    return style + "\n";
};
_Ielement_idCount = { value: 0 };
customElements.define("i-element", Ielement, { extends: "div" });
class Itext extends Ielement {
    constructor(container, text, options = {}) {
        super(container, options);
        _Itext_instances.add(this);
        _Itext_interval.set(this, 0);
        _Itext_tempDiv.set(this, document.createElement("div"));
        _Itext_originalHTML.set(this, void 0);
        this.isEnd = false;
        __classPrivateFieldGet(this, _Itext_instances, "m", _Itext_setupText).call(this, text, options.speed ?? 24);
    }
    // アニメーションを即座に完了
    finish() {
        clearInterval(__classPrivateFieldGet(this, _Itext_interval, "f"));
        this.innerHTML = __classPrivateFieldGet(this, _Itext_originalHTML, "f");
        this.isEnd = true;
        this.ready = Promise.resolve();
    }
}
_Itext_interval = new WeakMap(), _Itext_tempDiv = new WeakMap(), _Itext_originalHTML = new WeakMap(), _Itext_instances = new WeakSet(), _Itext_setupText = async function _Itext_setupText(text, speed) {
    if (text.endsWith(".html")) {
        this.innerHTML = "読み込み中...";
        const res = await fetch(text);
        text = await res.text();
    }
    // 元のHTMLを保存
    __classPrivateFieldSet(this, _Itext_originalHTML, text.replace(/\s{2,}/g, " ").replace(/\n/g, ""), "f");
    __classPrivateFieldGet(this, _Itext_tempDiv, "f").innerHTML = __classPrivateFieldGet(this, _Itext_originalHTML, "f");
    // 表示用の要素を初期化
    this.innerHTML = __classPrivateFieldGet(this, _Itext_originalHTML, "f");
    __classPrivateFieldGet(this, _Itext_instances, "m", _Itext_processTextNodes).call(this, this);
    this.ready = new Promise((resolve) => {
        // アニメーション開始
        __classPrivateFieldSet(this, _Itext_interval, setInterval(() => {
            __classPrivateFieldGet(this, _Itext_instances, "m", _Itext_updateText).call(this, resolve);
        }, 1000 / speed), "f");
    });
}, _Itext_processTextNodes = function _Itext_processTextNodes(element) {
    const childNodes = Array.from(element.childNodes);
    childNodes.forEach((node) => {
        if (node.nodeType === Node.TEXT_NODE) {
            const text = node.textContent?.trim();
            if (text) {
                // テキストノードをspanで置き換え
                const span = document.createElement("span");
                span.setAttribute("data-original", text);
                span.textContent = "";
                node.parentNode?.replaceChild(span, node);
            }
        }
        else if (node.nodeType === Node.ELEMENT_NODE) {
            // 要素ノードの場合は、その子要素も処理
            __classPrivateFieldGet(this, _Itext_instances, "m", _Itext_processTextNodes).call(this, node);
            const elem = node;
            // ルビ要素の場合は特別な属性を設定
            if (elem.tagName.toLowerCase() === "rt") {
                elem.querySelectorAll("span[data-original]").forEach((span) => {
                    span.setAttribute("data-ruby", "true");
                });
            }
        }
    });
}, _Itext_updateText = function _Itext_updateText(resolve) {
    const spans = Array.from(this.getElementsByTagName("span")).filter((span) => span.hasAttribute("data-original") &&
        span.textContent.length < span.getAttribute("data-original").length);
    if (spans.length === 0) {
        clearInterval(__classPrivateFieldGet(this, _Itext_interval, "f"));
        this.innerHTML = __classPrivateFieldGet(this, _Itext_originalHTML, "f");
        this.isEnd = true;
        resolve();
        return;
    }
    // メインのテキストを取得（ルビ以外）
    const mainSpan = spans.find((span) => !span.hasAttribute("data-ruby"));
    if (mainSpan) {
        const originalText = mainSpan.getAttribute("data-original");
        const currentLength = mainSpan.textContent.length;
        mainSpan.textContent = originalText.substring(0, currentLength + 1);
        // ルビ元の文字が表示されたかチェック
        const rubyBase = mainSpan.closest("ruby");
        if (rubyBase) {
            const rt = rubyBase.querySelector("rt");
            if (rt && rt.querySelector("span[data-original]")) {
                const rtSpan = rt.querySelector("span[data-original]");
                const originalRuby = rtSpan.getAttribute("data-original");
                rtSpan.textContent = originalRuby.substring(0, ((currentLength + 1) / originalText.length) * originalRuby.length);
            }
        }
    }
};
customElements.define("i-text", Itext, { extends: "div" });
class Icommand extends Ielement {
    constructor(container, dict, options = {}) {
        super(container, options);
        _Icommand_instances.add(this);
        _Icommand_handlerDict.set(this, new Idict({}));
        _Icommand_optionDict.set(this, new Idict({}));
        _Icommand_branch.set(this, "");
        _Icommand_options.set(this, void 0);
        __classPrivateFieldSet(this, _Icommand_options, options, "f");
        __classPrivateFieldSet(this, _Icommand_optionDict, dict, "f");
        __classPrivateFieldGet(this, _Icommand_instances, "m", _Icommand_setOptions).call(this);
    }
    cancel(depth) {
        for (let i = 0; i < depth; i++) {
            if (__classPrivateFieldGet(this, _Icommand_branch, "f") == "")
                break;
            __classPrivateFieldSet(this, _Icommand_branch, __classPrivateFieldGet(this, _Icommand_branch, "f").substring(0, -1), "f");
        }
        __classPrivateFieldGet(this, _Icommand_instances, "m", _Icommand_setOptions).call(this);
    }
    on(regex, handler) {
        __classPrivateFieldGet(this, _Icommand_handlerDict, "f").dict[regex] = handler;
        return this;
    }
}
_Icommand_handlerDict = new WeakMap(), _Icommand_optionDict = new WeakMap(), _Icommand_branch = new WeakMap(), _Icommand_options = new WeakMap(), _Icommand_instances = new WeakSet(), _Icommand_setOptions = async function _Icommand_setOptions() {
    const optionList = __classPrivateFieldGet(this, _Icommand_optionDict, "f").get(__classPrivateFieldGet(this, _Icommand_branch, "f"));
    [...this.children].forEach((n) => {
        n.remove();
    });
    if (!optionList)
        return;
    for (const [i, option] of optionList.entries()) {
        const itext = new Itext(this, option);
        itext.classList.add("i-command-option");
        itext.onclick = () => {
            __classPrivateFieldGet(this, _Icommand_instances, "m", _Icommand_onclickOption).call(this, i);
        };
        await itext.ready;
    }
}, _Icommand_onclickOption = function _Icommand_onclickOption(i) {
    __classPrivateFieldSet(this, _Icommand_branch, __classPrivateFieldGet(this, _Icommand_branch, "f") + i, "f");
    __classPrivateFieldGet(this, _Icommand_instances, "m", _Icommand_setOptions).call(this);
    __classPrivateFieldGet(this, _Icommand_handlerDict, "f").get(__classPrivateFieldGet(this, _Icommand_branch, "f"))?.();
};
customElements.define("i-command", Icommand, { extends: "div" });
const sleep = (ms) => new Promise((resolve) => {
    setTimeout(() => {
        resolve();
    }, ms);
});
//# sourceMappingURL=Ielement.js.map