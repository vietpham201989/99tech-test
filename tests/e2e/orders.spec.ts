import { test, expect } from "../fixtures"
import * as util from "../../helpers/utilities"
import { HeaderMenu, OrdersInfo } from "../../helpers/constants"
import accData from "../../data/account.json"
type EnvName = "stg" | "uat"
const envName: EnvName = process.env.ENV as EnvName
const acc = accData[envName]

test.describe("Orders", { tag: ["@e2e", "@regression", "@orders"] }, () => {

  test.beforeEach(async ({ comPage, accountPage, cartFlow }) => {
    await comPage.openLoginPage()
    await accountPage.openLoginModal()
    await accountPage.login(acc.username, acc.password)
    await comPage.selectHeaderMenu(HeaderMenu.cart)
    await cartFlow.addCartIfNotExist(comPage.getPage())
    await comPage.selectHeaderMenu(HeaderMenu.cart)
  })

  test(
    "Place order with valid information",
    { tag: ["@orders01"] },
    async ({ comPage, cartPage }) => {
      const data: OrdersInfo = util.generateFakeOrdersInfo()
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
})
