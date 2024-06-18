import apiService from "@/services/apiService";
import { InvoicePayload } from "./types";

const actions = {
  async handleCreateInvoice({ commit }: any, payload: InvoicePayload) {
    try {
      const response = await apiService.createInvoice(payload);
      const data = await response.json();
      commit("SET_INVOICE_STATUS", data);
      return data;
    } catch (error) {
      commit("SET_INVOICE_STATUS", "failure");
      throw error;
    }
  },
};

export default actions;
