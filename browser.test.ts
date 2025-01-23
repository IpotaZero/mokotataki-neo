import { test } from "@playwright/test"

test("test browser", async ({ page }) => {
    // ブラウザが起動した時に表示されるページ
    await page.goto("http://192.168.0.152:8080/docs/")

    await page.pause()
})
