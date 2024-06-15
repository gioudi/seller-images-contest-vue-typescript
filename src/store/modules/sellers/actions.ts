import { Seller } from "./types";

const actions = {
  handleFetchSellers({ commit }: any) {
    //const response = await axios.get()
    const sellers: Seller[] = [{ id: 1, name: "Seller 1", points: 0 }];

    commit("SET_SELLERS", sellers);
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
