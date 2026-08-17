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

  test("Verify home page loads successfully", async ({ page }) => {
    await comPage.selectHeaderMenu(HeaderMenu.home)
    const currentUrl = page.url()
    expect(currentUrl).toBe(`${process.env.BASE_URL!}/index.html`)
  })

  test("Verify application logo is displayed", async ({ page }) => {
    await indexPage.tapLogo()
    const currentUrl = page.url()
    expect(currentUrl).toBe(`${process.env.BASE_URL!}/index.html`)
  })

  test("Verify navigation menu items", async ({ page }) => {
    await comPage.selectHeaderMenu(HeaderMenu.contact)
    expect(await contactPage.showContactPopup()).toBe(true)
    await comPage.closePopup()
    await comPage.delay(3000)
    await comPage.selectHeaderMenu(HeaderMenu.aboutUs)
    expect(await aboutPage.showAboutPopup()).toBe(true)
    await comPage.closePopup()
    await comPage.delay(3000)
    await comPage.selectHeaderMenu(HeaderMenu.cart)
    let currentUrl = page.url()
    expect(currentUrl).toBe(`${process.env.BASE_URL!}/cart.html`)
    expect(await comPage.isText("Products")).toBe(true)
    await comPage.delay(3000)
    await comPage.selectHeaderMenu(HeaderMenu.login)
    expect(await accPage.showLoginPopup()).toBe(true)
    await comPage.closePopup()
    await comPage.delay(3000)
    await comPage.selectHeaderMenu(HeaderMenu.signUp)
    expect(await accPage.showSignupPopup()).toBe(true)
    await comPage.closePopup()
    await comPage.delay(3000)
    await comPage.selectHeaderMenu(HeaderMenu.home)
    currentUrl = page.url()
    expect(currentUrl).toBe(`${process.env.BASE_URL!}/index.html`)
  })

  test("Verify product list is displayed", async () => {
    await comPage.selectHeaderMenu(HeaderMenu.home)
    const products = await indexPage.getProducts()
    expect(products.length).toBeGreaterThan(0)
  })

  test("Verify product card information", async () => {
    await comPage.selectHeaderMenu(HeaderMenu.home)
    const products = await indexPage.getProducts()
    expect(products.length).toBeGreaterThan(0)
    await indexPage.verifyProducts(products)
  })

  test("Click product image", async () => {
    await comPage.selectHeaderMenu(HeaderMenu.home)
    const products = await indexPage.getProducts()
    await indexPage.selectProduct(1)
    const product = await productPage.getProductInfo()
    expect(product.name).toBe(products[0].name)
  })

  test("Click product title", async () => {
    await comPage.selectHeaderMenu(HeaderMenu.home)
    const products = await indexPage.getProducts()
    await indexPage.selectProduct(products[0].name)
    const product = await productPage.getProductInfo()
    expect(product.name).toBe(products[0].name)
  })

  test("Verify Categories section is displayed", async () => {
    await comPage.selectHeaderMenu(HeaderMenu.home)
    expect(await comPage.isText("CATEGORIES")).toBe(true)
    expect(await comPage.isText(CategoriesMenu.phone)).toBe(true)
    expect(await comPage.isText(CategoriesMenu.laptops)).toBe(true)
    expect(await comPage.isText(CategoriesMenu.monitors)).toBe(true)
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

  test("Switch between categories", async () => {
    await comPage.selectHeaderMenu(HeaderMenu.home)
    await comPage.selectCategoriesMenu(CategoriesMenu.phone)
    await comPage.delay(3000)
    const productspOfPhone = await indexPage.getProducts()
    await comPage.selectCategoriesMenu(CategoriesMenu.laptops)
    await comPage.delay(3000)
    const productspOfLaptop = await indexPage.getProducts()
    await comPage.selectCategoriesMenu(CategoriesMenu.monitors)
    await comPage.delay(3000)
    const productspOfMonitors = await indexPage.getProducts()
    expect(productspOfPhone).not.toEqual(productspOfLaptop)
    expect(productspOfPhone).not.toEqual(productspOfMonitors)
    expect(productspOfLaptop).not.toEqual(productspOfMonitors)
    const hasCommon = (a: string[], b: string[]) => a.some((x) => b.includes(x))
    expect(hasCommon(productspOfPhone, productspOfLaptop)).toBeFalsy()
    expect(hasCommon(productspOfPhone, productspOfMonitors)).toBeFalsy()
    expect(hasCommon(productspOfLaptop, productspOfMonitors)).toBeFalsy()
  })

  test("Return to all products", async () => {
    await comPage.selectHeaderMenu(HeaderMenu.home)
    const products = await indexPage.getProducts()
    expect(products.length).toBeGreaterThan(0)
  })

  test("Verify Next button functionality", async () => {
    await comPage.selectHeaderMenu(HeaderMenu.home)
    const products = await indexPage.getProducts()
    await comPage.prevOrNextPage(PreNext.next)
    await comPage.delay(3000)
    const productsAfter = await indexPage.getProducts()
    expect(products).not.toEqual(productsAfter)
  })
  // Skip this because the application is under development.
  test.skip("Verify Previous button functionality", async () => {
    const productsBefore = await indexPage.getProducts()
    await comPage.prevOrNextPage(PreNext.next)
    await comPage.delay(3000)
    const productsAfter = await indexPage.getProducts()
    expect(productsBefore).not.toEqual(productsAfter)
    await comPage.prevOrNextPage(PreNext.previous)
    await comPage.delay(3000)
    const products = await indexPage.getProducts()
    //expect(products).toEqual(productsBefore)
  })

  // Skip this because the application is under development.
  test.skip("Pagination after category filter", async () => {
    const productsBefore = await indexPage.getProducts()
    await comPage.prevOrNextPage(PreNext.next)
    await comPage.delay(3000)
    const productsAfter = await indexPage.getProducts()
    expect(productsBefore).not.toEqual(productsAfter)
    await comPage.selectCategoriesMenu(CategoriesMenu.monitors)
    await comPage.delay(3000)
    const products = await indexPage.getProducts()
  })
})
