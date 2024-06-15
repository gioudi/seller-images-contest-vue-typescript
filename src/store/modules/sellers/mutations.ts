import { Seller, SellersState } from "./types";

const mutations = {
  SET_SELLERS(state: SellersState, sellers: Seller[]) {
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
      seller.points += points;
      if (seller.points >= 20) {
        state.contestEnded = true;
        state.winner = seller;
      }
      seller.clickable = false;
    }
  },
  SET_CLICKABLE_SELLER(state: SellersState) {
    state.sellers = state.sellers.map((seller) => ({
      ...seller,
      clickable: true,
    }));
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
