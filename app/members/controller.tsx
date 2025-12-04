import { ApiUrl } from "@/api/apiUrls";
import httpRequest from "@/api/AxiosInterseptor";

export default class MembersController {
  async getAllMembers() {
    const data = await httpRequest.get(ApiUrl.Member);
    return data?.data?.data?.members;
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
    const data = await httpRequest.patch(`${ApiUrl.Member}/${id}`, payload);
    return data?.data;
  }

  async uploadMedia(file: File, onUploadProgress?: (progress: number) => void) {
    const formData = new FormData();
    formData.append("file", file);
    const response = await httpRequest.post(
      `${ApiUrl.MEDIA_URL}/member`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (e) => {
          if (onUploadProgress && e.total) {
            onUploadProgress(Math.round((e.loaded * 100) / e.total));
          }
        },
      }
    );
    return response?.data?.data?.url;
  }
  async uploadFile(file: File, onUploadProgress?: (progress: number) => void) {
    const formData = new FormData();
    formData.append("file", file);
    const response = await httpRequest.post(`${ApiUrl.MEDIA_URL}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
      onUploadProgress: (e) => {
        if (onUploadProgress && e.total) {
          onUploadProgress(Math.round((e.loaded * 100) / e.total));
        }
      },
    });
    return response?.data?.data?.url;
  }
  async deleteMedia(url: string) {
    const response = await httpRequest.delete(
      `${ApiUrl.MEDIA_URL}/?url=${url}`
    );
    return response?.data?.url;
  }
  async memberProfile(id: string) {
    const data = await httpRequest.get(`${ApiUrl.Member}/${id}`);
    return data?.data?.data;
  }
}
