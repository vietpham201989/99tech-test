import { test, expect } from "../fixtures"
import { IndexPage } from "../../pageObjects/indexPage"

test.describe(
  "Login Page Tests",
  { tag: ["@e2e", "@regression", "@login"] },
  () => {
    let indexPage: IndexPage

    test.beforeEach(async ({ page }) => {
      indexPage = new IndexPage(page)
      await indexPage.openLoginPage()
    })

    test("Should login successfully with valid credential", { tag: ["@loginSuccess"] }, async () => {
      await indexPage.openLoginModal()
      await indexPage.login(process.env.USERNAME!, process.env.PASSWORD!)
      await expect(
        await indexPage.verifyUserLoggedIn(process.env.USERNAME!)
      ).toBeTruthy()
    })
  }
)
