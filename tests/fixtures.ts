import { test as base } from "@playwright/test"
import { allure } from "allure-playwright"
import { AccountPage } from "../pageObjects/accountPage"
import { CartPage } from "../pageObjects/cartPage"
import { ProductPage } from "../pageObjects/productPage"
import { IndexPage } from "../pageObjects/indexPage"
import { ComPage } from "../pageObjects/comPage"
import { ContactPage } from "../pageObjects/contactPage"
import { AboutusPage } from "../pageObjects/aboutUsPage"
import { CartFlow } from "../pageObjects/flow/cartFlow"

type CustomFixtures = {
  accountPage: AccountPage
  cartPage: CartPage
  cartFlow: CartFlow
  productPage: ProductPage
  indexPage: IndexPage
  comPage: ComPage
  contactPage: ContactPage
  aboutusPage: AboutusPage
}

export const test = base.extend<CustomFixtures>({
  page: async ({ page }, use, testInfo) => {
    await use(page)

    // Capture screenshot on test failure
    if (testInfo.status !== testInfo.expectedStatus) {
      const screenshot = await page.screenshot({
        fullPage: true,
      })

      // Attach screenshot to Allure report
      await allure.attachment("Screenshot on failure", screenshot, "image/png")
    }
  },
  accountPage: async ({ page }, use) => {
    await use(new AccountPage(page))
  },
  cartPage: async ({ page }, use) => {
    await use(new CartPage(page))
  },
  productPage: async ({ page }, use) => {
    await use(new ProductPage(page))
  },
  indexPage: async ({ page }, use) => {
    await use(new IndexPage(page))
  },
  comPage: async ({ page }, use) => {
    await use(new ComPage(page))
  },
  contactPage: async ({ page }, use) => {
    await use(new ContactPage(page))
  },
  aboutusPage: async ({ page }, use) => {
    await use(new AboutusPage(page))
  },
  cartFlow: async ({ page }, use) => {
    await use(new CartFlow(page))
  }
})

export { expect } from "@playwright/test"
