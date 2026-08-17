import { expect } from "@playwright/test"
import Ajv from "ajv"
import accData from "../data/account.json"
type EnvName = "stg" | "uat"
const envName: EnvName = process.env.ENV as EnvName
const acc = accData[envName]
const ajv = new Ajv()
export default class HelpersApi {
  // Send generic request with methods: GET, POST, DELETE
  async sendRequest(
    request: any,
    method: string,
    endpoint: string,
    headers?: any,
    payload?: any
  ): Promise<any> {
    const header: any = {}
    if (JSON.stringify(headers) != "{}") {
      header["headers"] = headers
    }
    if (JSON.stringify(payload) != "{}") {
      header["data"] = payload
    }
    let response
    if (method == "GET") {
      response = await request.get(endpoint, header)
    } else if (method == "POST") {
      response = await request.post(endpoint, header)
    } else if (method == "DELETE") {
      response = await request.delete(endpoint, header)
    } else if (method == "PATCH") {
      response = await request.patch(endpoint, header)
    } else if (method == "PUT") {
      response = await request.put(endpoint, header)
    }

    return response
  }

  async getToken(request: any) {
    const payload = {
      username: acc.username,
      password: Buffer.from(acc.password).toString("base64"),
    }
    const endPoint = "/login"
    const info = await this.handleApi(
      request,
      "POST",
      endPoint,
      {}, //header
      payload, //payload
      { status: 200 }
    )
    return await info.replace("Auth_token: ", "")
  }

  // Generic API handlers
  async handleApi(
    request: any,
    method: string,
    endpoint: string,
    headers?: any,
    payload?: any,
    expectedResponseData?: any
  ): Promise<any> {
    let result
    const response = await this.sendRequest(
      request,
      method,
      endpoint,
      headers,
      payload
    )
    const code = await response.status()

    expect(code).toBe(expectedResponseData.status)
    if (code === 200 || code === 201 || code === 202 || code === 204) {
      if (expectedResponseData.schema) {
        const responseData = await response.json()
        const validate = ajv.compile(expectedResponseData.schema)
        const valid = validate(responseData)
        if (!valid) {
          console.log(validate.errors)
        }
        expect(valid).toBe(true)
      }
      if (expectedResponseData.text) {
        expect(await response.text()).toBe(expectedResponseData.text)
      }
      if (expectedResponseData.message) {
        const responseData = await response.json()
        expect(await responseData.message).toBe(expectedResponseData.message)
      }
    } else {
      const responseData = await response.json()
      if (expectedResponseData.error) {
        expect(await responseData.error).toBe(expectedResponseData.error)
      }
      if (expectedResponseData.message) {
        expect(await responseData.message).toBe(expectedResponseData.message)
      }
      if (expectedResponseData.details) {
        expect(await responseData.details).toEqual(expectedResponseData.details)
      }
      if (expectedResponseData.error_description) {
        expect(await responseData.error_description).toEqual(
          expectedResponseData.error_description
        )
      }
    }
    try {
      result = await response.json()
    } catch (error) {
      result = await response.text()
    }
    return result
  }
}
