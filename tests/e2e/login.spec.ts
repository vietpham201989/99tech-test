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
    })

    test(
      "Login with valid credentials",
      { tag: ["@loginSuccess"] },
      async () => {
        await accPage.openLoginModal()
        await accPage.login(acc.user, acc.pass)
        await expect(await accPage.verifyUserLoggedIn(acc.user)).toBeTruthy()
      }
    )
    test("Login with incorrect password", async ({ page }) => {
      const accIncorrectPass = { ...acc }
      accIncorrectPass.pass = "admin2"
      await accPage.openLoginModal()
      const alertPromise = comPage.expectAlert(page, alert.wrongPass)
      await accPage.login(accIncorrectPass.user, accIncorrectPass.pass)
      await alertPromise
    })

    test(
      "Login with non-existing username",
      { tag: ["@loginSuccess"] },
      async ({ page }) => {
        const accNonExistUser = { ...acc }
        accNonExistUser.user = "non-existing"
        await accPage.openLoginModal()
        const alertPromise = comPage.expectAlert(page, alert.notExist)
        await accPage.login(accNonExistUser.user, accNonExistUser.pass)
        await alertPromise
      }
    )

    test(
      "Login with empty username",
      { tag: ["@loginSuccess"] },
      async ({ page }) => {
        const accBlankUser = { ...acc }
        accBlankUser.user = ""
        await accPage.openLoginModal()
        const alertPromise = comPage.expectAlert(page, alert.notUserAndPasss)
        await accPage.login(accBlankUser.user, accBlankUser.pass)
        await alertPromise
      }
    )

    test(
      "Login with empty password",
      { tag: ["@loginSuccess"] },
      async ({ page }) => {
        const accBlankPass = { ...acc }
        accBlankPass.pass = ""
        await accPage.openLoginModal()
        const alertPromise = comPage.expectAlert(page, alert.notUserAndPasss)
        await accPage.login(accBlankPass.user, accBlankPass.pass)
        await alertPromise
      }
    )

    test("Close Login popup", { tag: ["@loginSuccess"] }, async () => {
      await accPage.openLoginModal()
      expect(await accPage.showLoginPopup()).toBe(true)
      await comPage.closePopup("closeBtn")
      await comPage.delay(3000)
      expect(await accPage.showLoginPopup(2000)).toBe(false)
    })
  }
)
