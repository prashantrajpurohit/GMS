import { ApiUrl } from "@/api/apiUrls";
import httpRequest from "@/api/AxiosInterseptor";

export default class PaymentController {
  async getAllPayments(query: Record<string, any>) {
    const res = await httpRequest.get(ApiUrl.PAYMENTS, { params: query });
    return res?.data?.data;
  }
  async getPaymentsStats() {
    const res = await httpRequest.get(`${ApiUrl.DASHBOARD}/gym/payments`);
    return res?.data?.data;
  }
  async getPaymentHistoryById(id: string) {
    const res = await httpRequest.get(
      `${ApiUrl.PAYMENTS}/member/${id}/history`
    );
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
