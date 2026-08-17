import HelpersApi from "./HelpersApi"
//declare

export default class ProductsApi extends HelpersApi {
  // GET: /entries
  async getProduct(request: any, expectedResponse: any): Promise<any> {
    const header = {}
    const endPoint = "/entries"
    return await this.handleApi(
      request,
      "GET",
      endPoint,
      header, //header
      {}, //payload
      expectedResponse
    )
  }
  // POST: /view
  async postViewProduct(
    request: any,
    id: string,
    expectedResponse: any
  ): Promise<any> {
    const header = {}
    const endPoint = "/view"
    const payload = {
      id: id,
    }
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
