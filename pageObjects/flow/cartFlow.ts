import { ComPage } from "../../pageObjects/comPage"
import { IndexPage } from "../../pageObjects/indexPage"
import { ProductPage } from "../../pageObjects/productPage"
import { HeaderMenu, IconTable } from "../../helpers/constants"
// import { CartPage } from "../../pageObjects/cartPage"

let indexPage: IndexPage
let comPage: ComPage
let productPage: ProductPage
// let cartPage: CartPage

export class CartFlow {
  protected page: any
  constructor(page: any) {
    this.page = page
    indexPage = new IndexPage(page)
    comPage = new ComPage(page)
    productPage = new ProductPage(page)
    // cartPage = new CartPage(page)
  }

  async deleteAllCart() {
    const count = await comPage.countTable()
    if (count > 0) {
      for (let i = 0; i < count; i++) {
        await comPage.clickIconInTable("x", IconTable.delete, 1)
        await comPage.delay(3000)
      }
    }
  }

  async addCartIfNotExist(page: any) {
    const count = await comPage.countTable()
    if (count == 0) {
      await this.addCart(page)
    }
  }

  async addCart(page: any) {
    await comPage.selectHeaderMenu(HeaderMenu.home)
    const products = await indexPage.getProducts()
    await indexPage.selectProduct(products[0]["name"])
    const product = await productPage.getProductInfo()
    const alertPromise = comPage.expectAlert(page, "Product added")
    await productPage.addCart()
    await alertPromise
    return product
  }
}
