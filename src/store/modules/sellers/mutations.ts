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
};

export default mutations;
