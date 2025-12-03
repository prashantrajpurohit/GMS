import axios from "axios";
import { toast } from "sonner";
import { ApiStatus } from "@/helper/helper";
import { useDispatch } from "react-redux";
import { store } from "@/reduxstore/reduxStore";
import { logout } from "@/reduxstore/authSlice";

const httpRequest = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL + "/api",
  withCredentials: true,
  timeout: 10000, // 10 seconds timeout
});

// RESPONSE INTERCEPTOR
httpRequest.interceptors.response.use(
  function (response) {
    if (
      response.status === ApiStatus.STATUS_200 ||
      response.status === ApiStatus.STATUS_201
    ) {
      return response;
    } else if (response.status === ApiStatus.STATUS_403) {
      toast.error("Access forbidden");
    } else {
      toast.error(response.data?.message || "Something went wrong");
    }
    return response;
  },
  function (error) {
    const status = error.response?.status;
    const message = error?.response?.data?.message;

    switch (status) {
      case 401:
        toast.error(message || "Unauthorized. Please log in again.");
        store.dispatch(logout());
        break;

      case 403:
        toast.error(message || "Access forbidden");
        break;

      case 404:
        toast.error(message || "Resource not found");
        break;

      case 500:
        toast.error(message || "Server error. Please try again later.");
        break;

      case 422:
        toast.error(message || "Validation failed");
        break;

      default:
        toast.error(message || "An error occurred");
    }

    return Promise.reject(error);
  }
);

export default httpRequest;
