import { ApiUrl } from "@/api/apiUrls";
import httpRequest from "@/api/AxiosInterseptor";
import { Staff } from "@/types/types";

export default class StaffController {
  async getStaffList() {
    const data = await httpRequest.get(ApiUrl.STAFF);
    return data?.data?.data;
  }
  async addStaff(payload: Record<string, any>) {
    const data = await httpRequest.post(ApiUrl.STAFF, payload);
    return data?.data;
  }
  async getRoles() {
    const data = await httpRequest.get(ApiUrl.ROLES);
    return data?.data?.data;
  }
  async updateStaff({ id, ...payload }: Record<string, any>) {
    const data = await httpRequest.patch(`${ApiUrl.STAFF}/${id}`, payload);
    return data?.data;
  }
}
