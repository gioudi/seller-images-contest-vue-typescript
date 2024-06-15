import { InvoicesState } from "./types";

const mutations = {
  SET_INVOICE_STATUS(state: InvoicesState, status: boolean) {
    state.invoiceStatus = status;
  },
  FETCH_INVOICE_LOADING(state: InvoicesState, loading: boolean) {
    state.loading = loading;
    state.error = null;
  },
  FETCH_INVOICE_FAILURE(state: InvoicesState, error: string) {
    state.loading = false;
    state.error = error;
  },
};

export default mutations;
