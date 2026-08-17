//env
require("dotenv").config()
const env = process.env.ENV ? process.env.ENV : "STAGING"
//library
import { test } from "@playwright/test"
//class
import ProductsApi from "../../api/ProductsApi"
//data
//declare
const productApi = new ProductsApi()

test.describe("Product", () => {
  test("Verify getting products successfully", async ({ request }) => {
    const info = await productApi.getProduct(
      request,
      {
        status: 200,
      } // expected response
    )
    console.log(info)
  })
})
