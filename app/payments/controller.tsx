import { ApiUrl } from "@/api/apiUrls";
import httpRequest from "@/api/AxiosInterseptor";

export default class PaymentController {
  async getAllPayments() {
    const res = await httpRequest.get(ApiUrl.PAYMENTS);
    return res?.data?.data;
  }
  async updatePaymentById({
    id,
    payload,
  }: {
    id: string;
    payload: Record<string, any>;
  }) {
    const data = await httpRequest.patch(`${ApiUrl.PAYMENTS}/${id}`, payload);
    return data?.data;
  }
}
