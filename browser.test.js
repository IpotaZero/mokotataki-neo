"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const test_1 = require("@playwright/test");
(0, test_1.test)("test browser", async ({ page }) => {
    // ブラウザが起動した時に表示されるページ
    await page.goto("http://192.168.0.152:8080/docs/");
    await page.pause();
});
//# sourceMappingURL=browser.test.js.map