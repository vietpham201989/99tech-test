import { test, expect } from "../fixtures"
import { ComPage } from "../../pageObjects/comPage"
import { IndexPage } from "../../pageObjects/indexPage"
import { ProductPage } from "../../pageObjects/productPage"
import { CartPage } from "../../pageObjects/cartPage"
import { CartFlow } from "../../pageObjects/flow/cartFlow"
import { AccountPage } from "../../pageObjects/accountPage"
import { HeaderMenu, IconTable } from "../../helpers/constants"
import ui from "../../data/e2e/ui_data.json"

const alert = ui.alert

test.describe("Cart Tests", { tag: ["@e2e", "@regression", "@login"] }, () => {
  let comPage: ComPage
  let indexPage: IndexPage
  let productPage: ProductPage
  let cartPage: CartPage
  let cartFlow: CartFlow
  let accPage: AccountPage

  test.beforeEach(async ({ page }) => {
    comPage = new ComPage(page)
    indexPage = new IndexPage(page)
    productPage = new ProductPage(page)
    cartPage = new CartPage(page)
    cartFlow = new CartFlow(page)
    accPage = new AccountPage(page)
    await comPage.openLoginPage()
    await accPage.openLoginModal()
    await accPage.login(process.env.USERNAME!, process.env.PASSWORD!)
  })

  test("Add product to cart", { tag: ["@loginSuccess"] }, async ({ page }) => {
    await comPage.selectHeaderMenu(HeaderMenu.home)
    const products = await indexPage.getProducts()
    await indexPage.selectProduct(products[0]["name"])
    const alertPromise = comPage.expectAlert(page, alert.productAdded)
    await productPage.addCart()
    await alertPromise
  })
})
