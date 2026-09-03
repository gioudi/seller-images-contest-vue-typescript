import { InvoicePayload, InvoiceResponse } from "@/stores/invoices/types";
import { Seller } from "@/stores/sellers/types";
import axiosClient from "./axiosClient";

const apiService = {
  async getSellers(): Promise<Seller[]> {
    const response = await axiosClient.get<Seller[]>("/sellers");
    return response.data;
  },
  async createInvoice(payload: InvoicePayload): Promise<InvoiceResponse> {
    const response = await axiosClient.post<InvoiceResponse>(
      "/invoices",
      payload
    );
    return response.data;
  },
};

export default apiService;
