import { ApiUrl } from "@/api/apiUrls";
import httpRequest from "@/api/AxiosInterseptor";
import { PlanInterface } from "@/lib/validation-schemas";

export default class PlansController {
  async addPlan(payload: PlanInterface) {
    const data = await httpRequest.post(ApiUrl.PLAN, payload);
    return data?.data;
  }
  async editPlan(payload: PlanInterface & { _id: string }) {
    const data = await httpRequest.patch(
      `${ApiUrl.PLAN}/${payload._id}`,
      payload
    );
    return data?.data;
  }

  async getPlans() {
    const data = await httpRequest.get(ApiUrl.PLAN);
    return data?.data?.data;
  }
}
