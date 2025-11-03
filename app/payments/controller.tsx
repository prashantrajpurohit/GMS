import { ApiUrl } from "@/api/apiUrls";
import httpRequest from "@/api/AxiosInterseptor";

export default class PaymentController {
  async getAllPayments() {
    const data = await httpRequest.get(ApiUrl.PAYMENTS);
    return data?.data;
  }
  //   async getAllPayments() {
  //     const data = await httpRequest.get(ApiUrl.PAYMENTS);
  //     return data?.data;
  //   }
}
