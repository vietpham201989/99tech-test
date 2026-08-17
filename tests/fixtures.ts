import { test as base } from "@playwright/test"
import * as allure from "allure-js-commons"

export const test = base.extend({
  page: async ({ page }, use, testInfo) => {
    await use(page)

    // Capture screenshot on test failure
    if (testInfo.status !== testInfo.expectedStatus) {
      const screenshot = await page.screenshot({
        fullPage: true,
        type: "png",
      })

      // Attach screenshot to Allure report
      await allure.attachment(
        `Screenshot on failure - ${testInfo.title}`,
        screenshot,
        "image/png"
      )
    }
  },
})

export { expect } from "@playwright/test"
