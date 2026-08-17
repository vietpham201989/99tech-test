//env
require("dotenv").config()
const env = process.env.ENV ? process.env.ENV : "STAGING"
//library
import { test } from "@playwright/test"
//class
import CartApi from "../../api/CartApi"
import AccountApi from "../../api/AccountApi"
//data
import accData from "../../data/account.json"
import respData from "../../data/api/schema/cart_resp.json"
type EnvName = "stg" | "uat"
const envName: EnvName = process.env.ENV as EnvName
const acc = accData[envName]
const schema = respData.VIEWCART_SCHEMA
//declare
const cartApi = new CartApi()
const accApi = new AccountApi()

test.describe("Cart", () => {
  test(
    "Verify view cart of user successfully",
    { tag: ["@api", "@regression"] },
    async ({ request }) => {
      const token = await accApi.getToken(request)
      const info = await cartApi.postViewCart(
        request,
        token,
        {
          status: 200,
          schema,
        } // expected response
      )
      console.log(info)
    }
  )
})
