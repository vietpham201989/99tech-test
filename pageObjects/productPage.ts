import { Locator, Page } from "@playwright/test"
import { BasePage } from "./basePage"

export class ProductPage extends BasePage {
  readonly addCartBtn: Locator
  readonly productName: Locator
  readonly productPrice: Locator
  readonly productDescription: Locator

  constructor(page?: Page) {
    super(page)
    this.addCartBtn = this.page.locator(`//a[text()='Add to cart']`)
    this.productName = this.page.locator(`//*[@class="name"]`)
    this.productPrice = this.page.locator(`//*[@class="price-container"]`)
    this.productDescription = this.page.locator(`//*[@id="more-information"]/p`)
  }

  async getProductInfo() {
    const name = await this.getText(this.productName)
    const price = await this.getText(this.productPrice)
    const description = await this.getText(this.productDescription)
    return { name, price, description }
  }

  async addCart() {
    await this.click(this.addCartBtn)
  }
}
