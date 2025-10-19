import { ApiUrl } from "@/api/apiUrls";
import httpRequest from "@/api/AxiosInterseptor";

export default class MembersController {
  async getAllMembers() {
    const data = await httpRequest.get(ApiUrl.Member);
    return data?.data;
  }
  async addMember(payload: Record<string, any>) {
    const data = await httpRequest.post(ApiUrl.Member, payload);
    return data?.data;
  }
  async updateMember({
    id,
    payload,
  }: {
    id: string;
    payload: Record<string, any>;
  }) {
    const data = await httpRequest.put(ApiUrl.Member, payload);
    return data?.data;
  }
}
