import apiService from "@/services/apiService";
import toastService from "@/utils/toastService";

const actions = {
  async handleFetchSellers({ commit }: any) {
    commit("FETCH_SELLERS_LOADING", true);

    try {
      const response = await apiService.getSellers();
      commit("SET_SELLERS", response);
    } catch (error: any) {
      commit("FETCH_SELLERS_FAILURE", error.message);
      const errorMessage =
        error.response?.data?.message || "Error fetching sellers";
      toastService.showError(errorMessage);
    } finally {
      commit("FETCH_SELLERS_LOADING", false);
    }
  },
  handleAddSeller({ commit }: any) {
    //Consume Api
    const seller: any = [];
    commit("ADD_SELLER", seller);
  },
  handleUpdateSellerPoints({ commit }: any) {
    // API call
    const payload: any = 0;
    commit("UPDATE_SELLER_POINTS", payload);
  },
};

export default actions;
