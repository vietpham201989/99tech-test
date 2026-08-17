//library
import { test } from "@playwright/test"
//class
import ProductsApi from "../../api/ProductsApi"
//data
import respData from "../../data/api/schema/product_resp.json"
const schema = respData.PRODUCTS_SCHEMA
const productSchema = respData.PRODUCT_SCHEMA

//declare
const productApi = new ProductsApi()

test.describe("Product", () => {
  test(
    "[GET] /entries - Verify get products successfully",
    { tag: ["@api", "@regression"] },
    async ({ request }) => {
      const info = await productApi.getProduct(
        request,
        {
          status: 200,
          schema,
        } // expected response
      )
      console.log(info)
    }
  )

  test(
    "[POS] /view - Verify view product successfully",
    { tag: ["@api", "@regression"] },
    async ({ request }) => {
      const products = await productApi.getProduct(request, { status: 200 })
      const info = await productApi.postViewProduct(
        request,
        products["Items"][0]["id"],
        {
          status: 200,
          schema: productSchema,
        } // expected response
      )
      console.log(info)
    }
  )
})
