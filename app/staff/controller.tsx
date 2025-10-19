import { ApiUrl } from "@/api/apiUrls";
import httpRequest from "@/api/AxiosInterseptor";

export default class StaffController {
  async getStaffList() {
    const data = await httpRequest.get(ApiUrl.STAFF);
    return data?.data;
  }
  async addStaff(payload: Record<string, any>) {
    const data = await httpRequest.post(ApiUrl.STAFF);
    return data?.data;
  }
  async updateStaff({
    id,
    payload,
  }: {
    id: string;
    payload: Record<string, any>;
  }) {
    const data = await httpRequest.put(ApiUrl.STAFF);
    return data?.data;
  }
}
