import { Locator, Page, expect } from "@playwright/test"
import { BasePage } from "./basePage"
import { String } from "typescript-string-operations"

export class IndexPage extends BasePage {
  readonly logo: Locator
  readonly productRow: string
  readonly productImg: string
  readonly productName: string
  readonly productPrice: string
  readonly productArticle: string
  readonly productSelect: string

  constructor(page?: Page) {
    super(page)
    this.logo = this.page.locator(`//*[@id="nava"]/img`)
    this.productRow = `//*[@id="tbodyid"]/div`
    this.productImg = `${this.productRow}[{0}]//a/img`
    this.productName = `${this.productRow}[{0}]//*[@class="card-title"]/a`
    this.productPrice = `${this.productRow}[{0}]//h5`
    this.productArticle = `${this.productRow}[{0}]//*[@id="article"]`
    this.productSelect = `${this.productRow}//*[@class="card-title"]/a[contains(text(),'{0}')]`
  }

  async tapLogo() {
    await this.click(this.logo)
  }

  async getProducts(timeout: number = 3000) {
    await this.delay(timeout)
    const arr = []
    const count = await this.count(this.page.locator(this.productRow))
    for (let i = 1; i <= count; i++) {
      const imgLoc = String.format(this.productImg, i)
      const nameLoc = String.format(this.productName, i)
      const priceLoc = String.format(this.productPrice, i)
      const articleLoc = String.format(this.productArticle, i)
      const img = await this.getAttr(imgLoc, "src")
      const name = await this.getText(nameLoc)
      const price = await this.getText(priceLoc)
      const article = await this.getText(articleLoc)
      arr.push({ img, name, price, article })
    }
    return arr
  }

  async selectProduct(nameOrIndex: any) {
    let loc = String.format(this.productImg, nameOrIndex)
    if (typeof nameOrIndex === "string") {
      loc = String.format(this.productSelect, nameOrIndex)
    }
    await this.click(this.page.locator(loc))
  }

  async verifyProducts(products: any) {
    products.forEach((product: any, i: any) => {
      expect(product.img, `Image is null at index ${i}`).toBeTruthy()
      expect(product.name, `Name is null at index ${i}`).toBeTruthy()
      expect(product.price, `Price is null at index ${i}`).toBeTruthy()
      expect(product.article, `Article is null at index ${i}`).toBeTruthy()
      expect(product.img.trim()).not.toBe("")
      expect(product.name.trim()).not.toBe("")
      expect(product.price.trim()).not.toBe("")
      expect(product.article.trim()).not.toBe("")
    })
  }
}
