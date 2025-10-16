import { ApiUrl } from "@/api/apiUrls";
import httpRequest from "@/api/AxiosInterseptor";
import { LoginParams } from "@/types/types";

export class CommonContoller {
  async post(body: LoginParams) {
    const { data } = await httpRequest.post(ApiUrl.LOGIN_URL, body);
    return data;
  }
}
