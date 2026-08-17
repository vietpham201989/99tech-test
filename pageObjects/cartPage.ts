import { Locator, Page } from "@playwright/test"
import { BasePage } from "./basePage"
import { OrdersInfo } from "../helpers/constants"

export class CartPage extends BasePage {
  readonly placeOrderBtn: Locator
  readonly purchaseBtn: Locator
  readonly nameInput: Locator
  readonly countryInput: Locator
  readonly cityInput: Locator
  readonly cardInput: Locator
  readonly monthInput: Locator
  readonly yearInput: Locator

  constructor(page?: Page) {
    super(page)
    this.placeOrderBtn = this.page.locator(`//button[text()='Place Order']`)
    this.purchaseBtn = this.page.locator(`//button[text()='Purchase']`)
    this.nameInput = this.page.locator(`//input[@id="name"]`)
    this.countryInput = this.page.locator(`//input[@id="country"]`)
    this.cityInput = this.page.locator(`//input[@id="city"]`)
    this.cardInput = this.page.locator(`//input[@id="card"]`)
    this.monthInput = this.page.locator(`//input[@id="month"]`)
    this.yearInput = this.page.locator(`//input[@id="year"]`)
  }

  async tapPlaceOrderBtn() {
    await this.click(this.placeOrderBtn)
  }

  async showPlaceOrderPopup(time?: number): Promise<boolean> {
    return await this.isDisplayed(this.nameInput, time)
  }

  async placeOrder(ordersInfo: OrdersInfo) {
    await this.delay(3000)
    await this.fill(this.nameInput, ordersInfo.name || "")
    await this.fill(this.countryInput, ordersInfo.country || "")
    await this.fill(this.cityInput, ordersInfo.city || "")
    await this.fill(this.cardInput, ordersInfo.creditCard || "")
    await this.fill(this.monthInput, ordersInfo.month || "")
    await this.fill(this.yearInput, ordersInfo.year || "")
    await this.delay(3000)
    await this.click(this.purchaseBtn)
    await this.delay(3000)
  }
}
