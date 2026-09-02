import { InvoicePayload, InvoiceResponse } from "@/stores/invoices/types";
import { Seller } from "@/stores/sellers/types";
import getErrorMessage from "@/utils/getErrorMessage";
import axios from "axios";
import toastService from "@/utils/toastService";

const API_URL =
  import.meta.env.VITE_ALEGRA_BASE_URL || "https://api.alegra.com/api/v1/";
const API_KEY = import.meta.env.VITE_ALEGRA_API_KEY;
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
    Authorization: `Basic ${API_KEY ?? ""}`,
  },
});

const apiService = {
  async getSellers(): Promise<Seller[]> {
    try {
      const response = await apiClient.get<Seller[]>("/sellers");
      return response.data;
    } catch (error) {
      const errorMessage = getErrorMessage(error, "Error fetching sellers");
      toastService.showError(errorMessage);

      throw new Error(errorMessage);
    }
  },
  async createInvoice(payload: InvoicePayload): Promise<InvoiceResponse> {
    try {
      const response = await apiClient.post<InvoiceResponse>(
        "/invoices",
        payload
      );
      return response.data;
    } catch (error) {
      const errorMessage = getErrorMessage(error, "Error creating an Invoice");
      toastService.showError(errorMessage);

      throw new Error(errorMessage);
    }
  },
};

export default apiService;
