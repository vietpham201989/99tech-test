import { When, Then } from "@cucumber/cucumber"
import { expect } from "@playwright/test"
import { HeaderMenu } from "../../../../helpers/constants"
import ui from "../../../../data/e2e/ui_data.json"
import { world } from "./world"

const alert = ui.alert

When("I select the first product", async () => {
  const products = await world.indexPage.getProducts()
  await world.indexPage.selectProduct(products[0]["name"])
})

Then("I add the product to cart", async () => {
  const alertPromise = world.comPage.expectAlert(world.page, alert.productAdded)
  await world.productPage.addCart()
  await alertPromise
})

