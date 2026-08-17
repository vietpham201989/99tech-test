import { test, expect } from "../fixtures"
import accData from "../../data/account.json"
type EnvName = "stg" | "uat"
const envName: EnvName = process.env.ENV as EnvName
const acc = accData[envName]
test.describe(
  "Login Page Tests",
  { tag: ["@e2e", "@regression", "@login"] },
  () => {

    test.beforeEach(async ({ comPage }) => {
      await comPage.openLoginPage()
      await comPage.delay(3000)
    })

    test(
      "Login with valid credentials",
      { tag: ["@loginSuccess"] },
      async ({accountPage}) => {
        await accountPage.openLoginModal()
        await accountPage.login(acc.password, acc.password)
        await accountPage.delay(3000)
        await expect(
          await accountPage.verifyUserLoggedIn(acc.username)
        ).toBeTruthy()
      }
    )
  }
)
