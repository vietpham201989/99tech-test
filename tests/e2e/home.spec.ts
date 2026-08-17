import { test, expect } from "../fixtures"
import { ComPage } from "../../pageObjects/comPage"
import { IndexPage } from "../../pageObjects/indexPage"
import { ProductPage } from "../../pageObjects/productPage"
import { CartPage } from "../../pageObjects/cartPage"
import { ContactPage } from "../../pageObjects/contactPage"
import { AccountPage } from "../../pageObjects/accountPage"
import { AboutusPage } from "../../pageObjects/aboutUsPage"
import { HeaderMenu, CategoriesMenu, PreNext } from "../../helpers/constants"

test.describe("Cart Tests", { tag: ["@e2e", "@regression", "@login"] }, () => {
  let comPage: ComPage
  let indexPage: IndexPage
  let productPage: ProductPage
  let cartPage: CartPage
  let contactPage: ContactPage
  let accPage: AccountPage
  let aboutPage: AboutusPage

  test.beforeEach(async ({ page }) => {
    comPage = new ComPage(page)
    indexPage = new IndexPage(page)
    productPage = new ProductPage(page)
    cartPage = new CartPage(page)
    contactPage = new ContactPage(page)
    accPage = new AccountPage(page)
    aboutPage = new AboutusPage(page)
    await comPage.openLoginPage()
  })

  test("Filter products by Phones category", async () => {
    await comPage.selectHeaderMenu(HeaderMenu.home)
    await comPage.selectCategoriesMenu(CategoriesMenu.phone)
    const products = await indexPage.getProducts()
    expect(products.length).toBeGreaterThan(0)
    await indexPage.verifyProducts(products)
  })

  test("Filter products by Laptops category", async () => {
    await comPage.selectHeaderMenu(HeaderMenu.home)
    await comPage.selectCategoriesMenu(CategoriesMenu.laptops)
    const products = await indexPage.getProducts()
    expect(products.length).toBeGreaterThan(0)
    await indexPage.verifyProducts(products)
  })

  test("Filter products by Monitors category", async () => {
    await comPage.selectHeaderMenu(HeaderMenu.home)
    await comPage.selectCategoriesMenu(CategoriesMenu.monitors)
    const products = await indexPage.getProducts()
    expect(products.length).toBeGreaterThan(0)
    await indexPage.verifyProducts(products)
  })
})
