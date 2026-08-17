import HelpersApi from "./HelpersApi"
//declare

export default class CartApi extends HelpersApi {
  // POST: /viewcart
  async postViewCart(
    request: any,
    cookie: string,
    expectedResponse: any
  ): Promise<any> {
    const header = {}
    const payload = {
      cookie: cookie,
      flag: true,
    }
    const endPoint = "/viewcart"
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
