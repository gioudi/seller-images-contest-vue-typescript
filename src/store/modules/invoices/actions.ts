import apiService from "@/services/apiService";

const actions = {
  async createInvoice({ commit }: any, payload: any) {
    try {
      const response = await apiService.createInvoice(payload);

      const data = await response.json();
      commit("SET_INVOICE_STATUS", "success");
      return data;
    } catch (error) {
      commit("SET_INVOICE_STATUS", "failure");
      throw error;
    }
  },
};

export default actions;
