import { Seller, SellersState } from "./types";

const mutations = {
  SET_SELLER(state: SellersState, sellers: Seller[]) {
    state.sellers = sellers;
  },
  ADD_SELLER(state: SellersState, seller: Seller) {
    state.sellers.push(seller);
  },
  UPDATE_SELLER_POINTS(
    state: SellersState,
    { id, points }: { id: number; points: number }
  ) {
    const seller = state.sellers.find((vendor) => vendor.id === id);
    if (seller) {
      seller.points = points;
    }
  },
  FETCH_SELLERS_LOADING(state: SellersState, loading: boolean) {
    state.loading = loading;
    state.error = null;
  },
  FETCH_SELLERS_FAILURE(state: SellersState, error: string) {
    state.loading = false;
    state.error = error;
  },
};

export default mutations;
