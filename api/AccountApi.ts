import HelpersApi from "./HelpersApi"
//declare

export default class AccountApi extends HelpersApi {
  // POST: /check
  async postCheck(
    request: any,
    token: string,
    expectedResponse: any
  ): Promise<any> {
    let header = {}
    const payload = {
      token: token,
    }
    const endPoint = "/check"
    return await this.handleApi(
      request,
      "POST",
      endPoint,
      header, //header
      payload, //payload
      expectedResponse
    )
  }

  // POST: /login
  async postLogin(
    request: any,
    user: string,
    pwd: string,
    expectedResponse: any
  ): Promise<any> {
    let header = {}
    console.log()

    const payload = {
      username: user,
      password: Buffer.from(pwd).toString("base64"),
    }
    const endPoint = "/login"
    return await this.handleApi(
      request,
      "POST",
      endPoint,
      header, //header
      payload, //payload
      expectedResponse
    )
  }
}
