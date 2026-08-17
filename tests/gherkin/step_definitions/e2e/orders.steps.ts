import { When, Then, setDefaultTimeout } from "@cucumber/cucumber"
import { expect } from "@playwright/test"
import * as util from "../../../../helpers/utilities"
import { OrdersInfo } from "../../../../helpers/constants"
import { world } from "./world"

// Set default timeout to 30 seconds for all steps
setDefaultTimeout(30 * 1000)

let tableData: any[]
let total: number
let orderData: OrdersInfo

When("I get the cart table data", async () => {
  tableData = await world.comPage.formatTable()
})

When("I calculate the total price", async () => {
  total = util.priceTotalCart(tableData)
})

When("I fill in order information", async () => {
  orderData = util.generateFakeOrdersInfo()
  await world.cartPage.placeOrder(orderData)
})

When("I submit the order", async () => {
  // Order is already submitted in placeOrder method
})

Then("I should see the order amount in the confirmation", async () => {
  const sweetAlert = await world.comPage.getSweetAlert()
  expect(sweetAlert.details).toContain(`Amount: ${total} USD`)
})

Then("I should see the credit card number in the confirmation", async () => {
  const sweetAlert = await world.comPage.getSweetAlert()
  expect(sweetAlert.details).toContain(`Card Number: ${orderData.creditCard}`)
})

Then("I should see the customer name in the confirmation", async () => {
  const sweetAlert = await world.comPage.getSweetAlert()
  expect(sweetAlert.details).toContain(`Name: ${orderData.name}`)
})

