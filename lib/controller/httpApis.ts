import { ApiUrl } from "@/api/apiUrls";
import httpRequest from "@/api/AxiosInterseptor";
import { LoginParams } from "@/types/types";

export class CommonContoller {
  async post(body: LoginParams) {
    const { data } = await httpRequest.post(ApiUrl.LOGIN_URL, body);
    return data;
  }
  async sentOTPonMail(body: { email: string }) {
    const res = await httpRequest.post(
      `${ApiUrl.AUTH}/verify-email/request`,
      body
    );
    return res?.data;
  }
  async verifyMailOtp(body: { email: string; otp: string }) {
    const res = await httpRequest.post(
      `${ApiUrl.AUTH}/verify-email/confirm`,
      body
    );
    return res?.data;
  }
  async forgotPassword(payload: { email: string }) {
    const data = await httpRequest.post(`${ApiUrl.FORGOT_PASS_URL}`, payload);
    return data.data;
  }
  async changePass(payload: { oldPassword: string; newPassword: string }) {
    const data = await httpRequest.post(`${ApiUrl.CHANGE_PASS_URL}`, payload);
    return data.data;
  }
}
