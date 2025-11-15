import { ApiUrl } from "@/api/apiUrls";
import httpRequest from "@/api/AxiosInterseptor";

export default class DashboardController{
    async getGymDashboard(){
        const res=await httpRequest.get(`${ApiUrl.DASHBOARD}/gym`);
        return res?.data
    }
}