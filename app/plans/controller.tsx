import { ApiUrl } from "@/api/apiUrls";
import httpRequest from "@/api/AxiosInterseptor";
import { PlanInterface } from "@/lib/validation-schemas";

export default class PlansController {
  async addPlan(payload: PlanInterface) {
    const data = await httpRequest.post(ApiUrl.PLAN, payload);
    return data?.data;
  }
  async editPlan({ _id, payload }: { _id: string; payload: PlanInterface }) {
    const data = await httpRequest.patch(`${ApiUrl.PLAN}/${_id}`, payload);
    return data?.data;
  }

  async getPlans() {
    const data = await httpRequest.get(ApiUrl.PLAN);
    return data?.data?.data;
  }
  async getPlansStats() {
    const data = await httpRequest.get(`${ApiUrl.DASHBOARD}/gym/plans`);
    return data?.data?.data;
  }
}
