import HelpersApi from "./HelpersApi"
//declare

export default class ProductsApi extends HelpersApi {
  // GET: /entries
  async getProduct(request: any, expectedResponse: any): Promise<any> {
    let header = {}
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
}
