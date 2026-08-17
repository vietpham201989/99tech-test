import { test } from "../fixtures"
import { HeaderMenu } from "../../helpers/constants"
import ui from "../../data/e2e/ui_data.json"
import accData from "../../data/account.json"
type EnvName = "stg" | "uat"
const envName: EnvName = process.env.ENV as EnvName
const acc = accData[envName]

const alert = ui.alert

test.describe("Cart Tests", { tag: ["@e2e", "@regression", "@cart"] }, () => {

  test.beforeEach(async ({ comPage, accountPage }) => {
    await comPage.openLoginPage()
    await accountPage.openLoginModal()
    await accountPage.login(acc.username, acc.password)
  })

  test("Add product to cart", { tag: ["@cart01"] }, async ({ comPage, indexPage, productPage }) => {
    await comPage.selectHeaderMenu(HeaderMenu.home)
    const products = await indexPage.getProducts()
    await indexPage.selectProduct(products[0]["name"])
    const alertPromise = comPage.expectAlert(comPage.getPage(), alert.productAdded)
    await productPage.addCart()
    await alertPromise
  })
})
