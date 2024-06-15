import toastService from "@/utils/toastService";
import axios from "axios";

const API_URL = "https://api.alegra.com/api/v1/";
const API_KEY = process.env.VUE_APP_ALEGRA_API_KEY;
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
    Authorization: `Basic ${API_KEY}}`,
  },
});

const apiService = {
  async getSellers() {
    try {
      const response = await apiClient.get("/sellers");
      return response.data;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Error fetching sellers";
      toastService.showError(errorMessage);

      throw new Error(errorMessage);
    }
  },
  async createInvoice(payload: any) {
    try {
      const response = await apiClient.post("/invoices", {
        body: JSON.stringify(payload),
      });
      return response.data;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Error creating an Invoice";
      toastService.showError(errorMessage);

      throw new Error(errorMessage);
    }
  },
};

export default apiService;
