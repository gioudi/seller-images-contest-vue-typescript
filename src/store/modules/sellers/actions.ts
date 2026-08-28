import { ActionContext } from "vuex";
import { AxiosError } from "axios";
import { RootState } from "@/store";
import apiService from "@/services/apiService";
import toastService from "@/utils/toastService";
import { Seller, SellersState } from "./types";

type SellersActionContext = ActionContext<SellersState, RootState>;

const actions = {
  async handleFetchSellers({ commit }: SellersActionContext) {
    commit("FETCH_SELLERS_LOADING", true);

    try {
      const response = await apiService.getSellers();
      const sellers = response.map((seller: Seller) => ({
        ...seller,
        points: 0,
        clickable: true,
        contestEnded: false,
      }));
      commit("SET_SELLERS", sellers);
    } catch (error) {
      const errorMessage =
        error instanceof AxiosError
          ? error.response?.data?.message ?? "Error fetching sellers"
          : error instanceof Error
          ? error.message
          : "Error fetching sellers";
      commit("FETCH_SELLERS_FAILURE", errorMessage);
      toastService.showError(errorMessage);
    } finally {
      commit("FETCH_SELLERS_LOADING", false);
    }
  },
};

export default actions;
