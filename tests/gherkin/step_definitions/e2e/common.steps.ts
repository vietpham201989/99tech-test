import { Given, When, Then } from "@cucumber/cucumber"
import { HeaderMenu, CategoriesMenu } from "../../../../helpers/constants"
import accData from "../../../../data/account.json"
import { expect } from "@playwright/test"
import { world } from "./world"

type EnvName = "stg" | "uat"
const envName: EnvName = (process.env.ENV as EnvName) || "stg"
const acc = accData[envName]

Given("I am on the login page", async () => {
  await world.comPage.openLoginPage()
})

Given("I wait for {int} seconds", async (seconds: number) => {
  await world.comPage.delay(seconds * 1000)
})

Given("I wait for the page to load", async () => {
  await world.comPage.delay(3000)
})

When('I select {string} from header menu', async (menu: string) => {
  await world.comPage.selectHeaderMenu(menu as HeaderMenu)
})

When('I select {string} from categories menu', async (category: string) => {
  await world.comPage.selectCategoriesMenu(category as CategoriesMenu)
})

Then("I should see products displayed", async () => {
  const products = await world.indexPage.getProducts()
  expect(products.length).toBeGreaterThan(0)
})

Then("I should verify all products are valid", async () => {
  const products = await world.indexPage.getProducts()
  await world.indexPage.verifyProducts(products)
})

Given("I open the login modal", async () => {
  await world.accountPage.openLoginModal()
})

Given("I login with valid credentials", async () => {
  await world.accountPage.login(acc.username, acc.password)
})

Then("I should be logged in successfully", async () => {
  await world.accountPage.delay(3000)
})

Then("I should see my username displayed", async () => {
  const isLoggedIn = await world.accountPage.verifyUserLoggedIn(acc.username)
  expect(isLoggedIn).toBeTruthy()
})

Then('I should see alert message {string}', async (message: string) => {
  const alertPromise = world.comPage.expectAlert(world.page, message)
  await alertPromise
})

Given("I add product to cart if cart is empty", async () => {
  await world.cartFlow.addCartIfNotExist(world.page)
})

When('I tap the {string} button', async (buttonText: string) => {
  if (buttonText === "Place Order") {
    await world.cartPage.tapPlaceOrderBtn()
  }
})

Then('I should see success message {string}', async (message: string) => {
  const sweetAlert = await world.comPage.getSweetAlert()
  expect(sweetAlert.title).toBe(message)
})

When('I tap {string} button', async (text: string) => {
  await world.comPage.tapText(text)
})

