import { ApiUrl } from "@/api/apiUrls";
import httpRequest from "@/api/AxiosInterseptor";

export default class EnquiriesController {
  async getAllEnquiries() {
    const data = await httpRequest.get(ApiUrl.ENQUIRES);
    return data?.data?.data;
  }
  async addEnquiry(payload: Record<string, any>) {
    const data = await httpRequest.post(ApiUrl.ENQUIRES, payload);
    return data?.data;
  }
  async convertToLead({ id }: { id: string }) {
    const data = await httpRequest.post(`${ApiUrl.ENQUIRES}/${id}/convert`);
    return data?.data;
  }
  async updateEnquiry({
    id,
    payload,
  }: {
    id: string;
    payload: Record<string, any>;
  }) {
    const data = await httpRequest.patch(`${ApiUrl.ENQUIRES}/${id}`, payload);
    return data?.data;
  }
}
