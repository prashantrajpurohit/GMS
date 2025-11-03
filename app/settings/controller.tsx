import { ApiUrl } from "@/api/apiUrls";
import httpRequest from "@/api/AxiosInterseptor";

export default class SettingsController {
  async getAllSettings(gymId: string) {
    const data = await httpRequest.get(`${ApiUrl.GYMS}/${gymId}/settings`);
    return data?.data;
  }
  async updateSettings({
    gymId,
    payload,
  }: {
    gymId: string;
    payload: Record<string, any>;
  }) {
    const data = await httpRequest.patch(
      `${ApiUrl.GYMS}/${gymId}/settings`,
      payload
    );
    return data?.data;
  }
}
