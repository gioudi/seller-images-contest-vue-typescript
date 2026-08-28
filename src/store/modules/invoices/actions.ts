import apiService from "@/services/apiService";
import { InvoicePayload } from "./types";

const actions = {
  async handleCreateInvoice({ commit }: any, payload: InvoicePayload) {
    try {
      const data = await apiService.createInvoice(payload);
      commit("SET_INVOICE_STATUS", data);
      return data;
    } catch (error) {
      commit("SET_INVOICE_STATUS", "failure");
      throw error;
    }
  },
};

export default actions;
