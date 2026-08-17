import { test, expect } from "../fixtures"
import { HeaderMenu, CategoriesMenu } from "../../helpers/constants"

test.describe("Cart Tests", { tag: ["@e2e", "@regression", "@home"] }, () => {

  test.beforeEach(async ({ comPage }) => {
    await comPage.openLoginPage()
    await comPage.delay(3000)
  })

  test("Filter products by Phones category", async ({comPage, indexPage}) => {
    await comPage.selectHeaderMenu(HeaderMenu.home)
    await comPage.selectCategoriesMenu(CategoriesMenu.phone)
    const products = await indexPage.getProducts()
    expect(products.length).toBeGreaterThan(0)
    await indexPage.verifyProducts(products)
  })

  test("Filter products by Laptops category", async ({comPage, indexPage}) => {
    await comPage.selectHeaderMenu(HeaderMenu.home)
    await comPage.selectCategoriesMenu(CategoriesMenu.laptops)
    const products = await indexPage.getProducts()
    expect(products.length).toBeGreaterThan(0)
    await indexPage.verifyProducts(products)
  })

  test("Filter products by Monitors category", async ({comPage, indexPage}) => {
    await comPage.selectHeaderMenu(HeaderMenu.home)
    await comPage.selectCategoriesMenu(CategoriesMenu.monitors)
    const products = await indexPage.getProducts()
    expect(products.length).toBeGreaterThan(0)
    await indexPage.verifyProducts(products)
  })
})
