import { Seller, SellersState } from "./types";

const getters = {
  getSellers(state: SellersState): Seller[] {
    return state.sellers;
  },
  getSellerById:
    (state: SellersState) =>
    (id: number): Seller | undefined => {
      return state.sellers.find((seller) => seller.id === id);
    },
  getError: (state: SellersState) => state.error,
  getLoading: (state: SellersState) => state.loading,
};

export default getters;
