import axios from "axios";
import { API } from "@/config";
import getErrorMessage from "@/utils/getErrorMessage";
import toastService from "@/utils/toastService";

const API_URL =
  import.meta.env.VITE_ALEGRA_BASE_URL || "https://api.alegra.com/api/v1/";
const API_KEY = import.meta.env.VITE_ALEGRA_API_KEY;

const axiosClient = axios.create({
  baseURL: API_URL,
  timeout: API.TIMEOUT_MS,
  headers: {
    "Content-Type": "application/json",
    Authorization: `Basic ${API_KEY ?? ""}`,
  },
});

axiosClient.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    const errorMessage = getErrorMessage(error, "Request failed");
    toastService.showError(errorMessage);
    return Promise.reject(new Error(errorMessage));
  }
);

export default axiosClient;
