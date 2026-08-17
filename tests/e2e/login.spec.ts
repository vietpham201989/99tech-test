import { test, expect } from "../fixtures"
import { ComPage } from "../../pageObjects/comPage"
import { AccountPage } from "../../pageObjects/accountPage"
import ui from "../../data/e2e/ui_data.json"
import accData from "../../data/account.json"
type EnvName = "stg" | "uat"
const envName: EnvName = process.env.ENV as EnvName
const acc = accData[envName]
const alert = ui.alert
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
        await accPage.login(acc.password, acc.password)
        await accPage.delay(3000)
        await expect(
          await accPage.verifyUserLoggedIn(acc.username)
        ).toBeTruthy()
      }
    )
  }
)
