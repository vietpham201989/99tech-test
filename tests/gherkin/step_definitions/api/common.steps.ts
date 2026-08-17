import { Given, When, Then, Before, After } from "@cucumber/cucumber"
import { APIRequestContext, chromium } from "@playwright/test"
import AccountApi from "../../../../api/AccountApi"
import CartApi from "../../../../api/CartApi"
import ProductsApi from "../../../../api/ProductsApi"
import { expect } from "@playwright/test"
import accData from "../../../../data/account.json"
import respData from "../../../../data/api/schema/cart_resp.json"
import productRespData from "../../../../data/api/schema/product_resp.json"
import { reportScenarioToAllure } from "../../helpers/allure-reporter"

let request: APIRequestContext
let browser: any // Store browser for cleanup
let accApi: AccountApi
let cartApi: CartApi
let productApi: ProductsApi
let token: string
let responseData: any
let products: any

type EnvName = "stg" | "uat"
// Set ENV if not already set to ensure HelpersApi can access it
if (!process.env.ENV) {
  process.env.ENV = "stg"
}
const envName: EnvName = (process.env.ENV as EnvName) || "stg"
const acc = accData[envName]
if (!acc) {
  throw new Error(`Account data not found for environment: ${envName}. Available: ${Object.keys(accData).join(", ")}`)
}
const baseURL = process.env.API_URL || "https://api.demoblaze.com"

Before(async (scenario) => {
  // Log scenario title and steps before running
  if (scenario) {
    const scenarioName = scenario.pickle?.name || "Unknown Scenario"
    const featureName = scenario.gherkinDocument?.feature?.name || "Unknown Feature"
    const steps = scenario.pickle?.steps || []
    
    console.log(`\n${"=".repeat(60)}`)
    console.log(`Feature: ${featureName}`)
    console.log(`Scenario: ${scenarioName}`)
    console.log(`${"=".repeat(60)}`)
    
    if (steps.length > 0) {
      console.log(`Steps:`)
      steps.forEach((step: any, index: number) => {
        const keyword = step.keyword || ""
        const text = step.text || ""
        console.log(`  ${index + 1}. ${keyword}${text}`)
      })
      console.log(`${"-".repeat(60)}`)
    }
  }

  // Create APIRequestContext using chromium browser context (headless, no UI)
  // This is the recommended way for API-only tests
  browser = await chromium.launch()
  const context = await browser.newContext({
    baseURL,
  })
  request = context.request
  accApi = new AccountApi()
  cartApi = new CartApi()
  productApi = new ProductsApi()
})

After(async (scenario) => {
  // Log scenario result
  if (scenario) {
    const result = scenario.result
    const scenarioName = scenario.pickle?.name || "Unknown Scenario"
    if (result) {
      const status = result.status === "PASSED" ? "✅ PASSED" : 
                     result.status === "FAILED" ? "❌ FAILED" : 
                     result.status === "SKIPPED" ? "⏭️  SKIPPED" : "⚠️  UNDEFINED"
      
      // Calculate duration properly
      let duration = ""
      if (result.duration) {
        const durationMs = typeof result.duration === 'number' ? result.duration : parseInt(String(result.duration)) || 0
        if (!isNaN(durationMs) && durationMs > 0) {
          const durationSec = Math.round(durationMs / 1000000000) // Convert nanoseconds to seconds
          duration = ` (${durationSec}s)`
        }
      }
      
      console.log(`${"-".repeat(60)}`)
      console.log(`${status}: ${scenarioName}${duration}`)
      if (result.status === "FAILED" && result.message) {
        console.log(`   Error: ${result.message}`)
      }
      console.log(`${"=".repeat(60)}\n`)
    }
  }

  // Create Allure test result for this scenario
  if (scenario) {
    try {
      reportScenarioToAllure(scenario)
    } catch (error) {
      console.warn("Failed to create Allure result:", error)
    }
  }

  // Clean up browser
  if (browser) {
    await browser.close()
  }
})

Given("I have a valid authentication token", async () => {
  if (!acc) {
    throw new Error(`Account data not found. ENV=${process.env.ENV}, envName=${envName}, available keys: ${Object.keys(accData).join(", ")}`)
  }
  token = await accApi.getToken(request)
})

When(
  'I send POST request to {string} with username and password',
  async (endpoint: string) => {
    if (!acc) {
      throw new Error(`Account data not found. ENV=${process.env.ENV}, envName=${envName}`)
    }
    responseData = await accApi.postLogin(request, acc.username, acc.password, {
      status: 200,
    })
    console.log(responseData)
  }
)

When('I send POST request to {string} with the token', async (endpoint: string) => {
  if (endpoint === "/check") {
    responseData = await accApi.postCheck(request, token, {
      status: 200,
    })
  } else if (endpoint === "/viewcart") {
    responseData = await cartApi.postViewCart(request, token, {
      status: 200,
      schema: respData.VIEWCART_SCHEMA,
    })
  }
  console.log(responseData)
})

When('I send GET request to {string}', async (endpoint: string) => {
  if (endpoint === "/entries") {
    responseData = await productApi.getProduct(request, {
      status: 200,
      schema: productRespData.PRODUCTS_SCHEMA,
    })
  }
  console.log(responseData)
})

When('I send POST request to {string} with the first product ID', async (endpoint: string) => {
  if (endpoint === "/view") {
    responseData = await productApi.postViewProduct(
      request,
      products["Items"][0]["id"],
      {
        status: 200,
        schema: productRespData.PRODUCT_SCHEMA,
      }
    )
  }
  console.log(responseData)
})

Then("I should receive status code {int}", async (statusCode: number) => {
  // Status code is already validated in the API methods
  expect(statusCode).toBe(200)
})

Then("I should see the login information", async () => {
  expect(responseData).toBeTruthy()
})

Then("I should see the account information", async () => {
  expect(responseData).toBeTruthy()
})

Then("I should see the cart information", async () => {
  expect(responseData).toBeTruthy()
})

Then("the response should match the view cart schema", async () => {
  // Schema validation is already done in the API method
  expect(responseData).toBeTruthy()
})

Then("I should see the products information", async () => {
  expect(responseData).toBeTruthy()
  products = responseData
})

Then("the response should match the products schema", async () => {
  // Schema validation is already done in the API method
  expect(responseData).toBeTruthy()
})

Then("I should see the product information", async () => {
  expect(responseData).toBeTruthy()
})

Then("the response should match the product schema", async () => {
  // Schema validation is already done in the API method
  expect(responseData).toBeTruthy()
})

Given("I have retrieved the list of products", async () => {
  products = await productApi.getProduct(request, { status: 200 })
  expect(products).toBeTruthy()
})

