//library
import { test } from "@playwright/test"
//class
import AccountApi from "../../api/AccountApi"
//data
import accData from "../../data/account.json"
type EnvName = "stg" | "uat"
const envName: EnvName = process.env.ENV as EnvName
const acc = accData[envName]
//declare
const accApi = new AccountApi()

test.describe("Account", () => {
  test("[POST] /login - Login successfully", { tag: ["@api", "@regression"] }, async ({ request }) => {
    const info = await accApi.postLogin(
      request,
      acc.username,
      acc.password,
      { status: 200, } // expected response
    )
    console.log(info)
  })
  
  test(
    "[POST] /check - Check account information",
    { tag: ["@api", "@regression"] },
    async ({ request }) => {
      const token = await accApi.getToken(request)
      const info = await accApi.postCheck(
        request,
        token,
        {
          status: 200,
        } // expected response
      )
      console.log(info)
    }
  )
})
