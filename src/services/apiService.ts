import { InvoicePayload, InvoiceResponse } from "@/stores/invoices/types";
import { Seller } from "@/stores/sellers/types";
import axiosClient from "./axiosClient";
import generateMockInvoice from "@/utils/generateMockInvoice";

// The Alegra account behind this project is a free/trial plan and does not
// have access to POST /invoices. Rather than let every submission fail,
// invoice creation is mocked client-side by default (SPEC-P4-09). Setting
// VITE_ALEGRA_MOCK_INVOICES=false restores the real Alegra call, e.g. if
// the plan is ever upgraded.
const MOCK_INVOICES =
  (import.meta.env.VITE_ALEGRA_MOCK_INVOICES ?? "true") !== "false";

const apiService = {
  async getSellers(): Promise<Seller[]> {
    const response = await axiosClient.get<Seller[]>("/sellers");
    return response.data;
  },
  async createInvoice(payload: InvoicePayload): Promise<InvoiceResponse> {
    if (MOCK_INVOICES) {
      return generateMockInvoice(payload);
    }
    const response = await axiosClient.post<InvoiceResponse>(
      "/invoices",
      payload
    );
    return response.data;
  },
};

export default apiService;
