import { test, expect } from "../fixtures"
import { ComPage } from "../../pageObjects/comPage"
import { AccountPage } from "../../pageObjects/accountPage"
import ui from "../../data/e2e/ui_data.json"

const alert = ui.alert
const acc = {
  user: process.env.USERNAME!,
  pass: process.env.PASSWORD!,
}
test.describe(
  "Login Page Tests",
  { tag: ["@e2e", "@regression", "@login"] },
  () => {
    let comPage: ComPage
    let accPage: AccountPage

    test.beforeEach(async ({ page }) => {
      comPage = new ComPage(page)
      accPage = new AccountPage(page)
      await comPage.openLoginPage()
      await comPage.delay(3000)
    })

    test(
      "Login with valid credentials",
      { tag: ["@loginSuccess"] },
      async () => {
        await accPage.openLoginModal()
        await accPage.login(acc.user, acc.pass)
        await accPage.delay(3000)
        await expect(await accPage.verifyUserLoggedIn(acc.user)).toBeTruthy()
      }
    )
  }
)
