import { test, expect } from "../fixtures"
import { ComPage } from "../../pageObjects/comPage"
import { CartPage } from "../../pageObjects/cartPage"
import { CartFlow } from "../../pageObjects/flow/cartFlow"
import * as util from "../../helpers/utilities"
import { AccountPage } from "../../pageObjects/accountPage"
import { HeaderMenu, OrdersInfo } from "../../helpers/constants"
import ui from "../../data/e2e/ui_data.json"

const alert = ui.alert
const data: OrdersInfo = {
  name: "Nguyen Van A",
  country: "Vietname",
  city: "City",
  creditCard: "880000",
  month: "1",
  year: "2026",
}

test.describe("Orders", { tag: ["@e2e", "@regression", "@login"] }, () => {
  let comPage: ComPage
  let cartPage: CartPage
  let cartFlow: CartFlow
  let accPage: AccountPage

  test.beforeEach(async ({ page }) => {
    comPage = new ComPage(page)
    cartPage = new CartPage(page)
    cartFlow = new CartFlow(page)
    accPage = new AccountPage(page)
    await comPage.openLoginPage()
    await accPage.openLoginModal()
    await accPage.login(process.env.USERNAME!, process.env.PASSWORD!)
    await comPage.selectHeaderMenu(HeaderMenu.cart)
    await cartFlow.addCartIfNotExist(page)
    await comPage.selectHeaderMenu(HeaderMenu.cart)
  })

  test(
    "Place order with valid information",
    { tag: ["@loginSuccess"] },
    async () => {
      const table = await comPage.formatTable()
      const total = util.priceTotalCart(table)
      await cartPage.tapPlaceOrderBtn()
      await cartPage.placeOrder(data)
      const sweetAlert = await comPage.getSweetAlert()
      expect(sweetAlert.title).toBe("Thank you for your purchase!")
      expect(sweetAlert.details).toContain(`Amount: ${total} USD`)
      expect(sweetAlert.details).toContain(`Card Number: ${data.creditCard}`)
      expect(sweetAlert.details).toContain(`Name: ${data.name}`)
      //expect(sweetAlert.details).toContain(`Date: ${ordersInfo.month}/${ordersInfo.year}`)
      await comPage.tapText("OK")
    }
  )
  test(
    "Place order without Name",
    { tag: ["@loginSuccess"] },
    async ({ page }) => {
      const dataWithoutName = { ...data }
      dataWithoutName.name = ""
      dataWithoutName["name"] = ""
      await cartPage.tapPlaceOrderBtn()
      const alertPromise = comPage.expectAlert(page, alert.notNameAndCreditCard)
      await cartPage.placeOrder(dataWithoutName)
      await alertPromise
    }
  )
  test(
    "Place order without Card number",
    { tag: ["@loginSuccess"] },
    async ({ page }) => {
      const dataWithoutCard = { ...data }
      dataWithoutCard.creditCard = ""
      await cartPage.tapPlaceOrderBtn()
      const alertPromise = comPage.expectAlert(page, alert.notNameAndCreditCard)
      await comPage.delay(3000)
      await cartPage.placeOrder(dataWithoutCard)
      await alertPromise
    }
  )
  test("Close Place Order popup", { tag: ["@loginSuccess"] }, async () => {
    await cartPage.tapPlaceOrderBtn()
    expect(await cartPage.showPlaceOrderPopup()).toBe(true)
    await comPage.closePopup("closeBtn")
    await comPage.delay(3000)
    expect(await cartPage.showPlaceOrderPopup(2000)).toBe(false)
  })
})
