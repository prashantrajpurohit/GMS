import httpRequest from "@/api/AxiosInterseptor";

export class DashboardController {
  async fetchDashboardData() {
    const response = await httpRequest.get("/dashboard/gym"); // Implementation to fetch dashboard data
    return response?.data?.data;
  }
}
