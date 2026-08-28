import { ActionContext } from "vuex";
import { RootState } from "@/store";
import apiService from "@/services/apiService";
import { InvoicesState, InvoicePayload } from "./types";

type InvoicesActionContext = ActionContext<InvoicesState, RootState>;

const actions = {
  async handleCreateInvoice(
    { commit }: InvoicesActionContext,
    payload: InvoicePayload
  ) {
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
