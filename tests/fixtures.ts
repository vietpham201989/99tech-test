import { test as base } from "@playwright/test"

export const test = base.extend({
  page: async ({ page }, use, testInfo) => {
    await use(page)

    // Capture screenshot on test failure
    if (testInfo.status !== testInfo.expectedStatus) {
      const screenshot = await page.screenshot({
        fullPage: true,
      })

      // Attach screenshot to Allure report via testInfo
      await testInfo.attach("screenshot-on-failure", {
        body: screenshot,
        contentType: "image/png",
      })
    }
  },
})

export { expect } from "@playwright/test"
