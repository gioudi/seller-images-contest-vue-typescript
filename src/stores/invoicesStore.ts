import { defineStore } from "pinia";
import { InvoicePayload } from "./invoices/types";
import apiService from "@/services/apiService";
import getErrorMessage from "@/utils/getErrorMessage";

export const useInvoicesStore = defineStore("invoices", {
  state: () => ({
    loading: false,
    error: null as string | null,
    invoiceStatus: false,
  }),
  actions: {
    setLoading(loading: boolean) {
      this.loading = loading;
      this.error = null;
    },
    setFailure(error: string) {
      this.loading = false;
      this.error = error;
    },
    async handleCreateInvoice(payload: InvoicePayload) {
      try {
        const data = await apiService.createInvoice(payload);
        this.invoiceStatus = true;
        return data;
      } catch (error) {
        this.invoiceStatus = false;
        this.setFailure(getErrorMessage(error, "Error creating an Invoice"));
        throw error;
      }
    },
  },
});
