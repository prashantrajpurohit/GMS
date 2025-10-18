import { ApiUrl } from "@/api/apiUrls";
import httpRequest from "@/api/AxiosInterseptor";

export default class PlansController {
  async addPlan(payload: any) {
    const data = await httpRequest.post(ApiUrl.AUTH_LOGOUT, payload);
    return data?.data;
  }
}
