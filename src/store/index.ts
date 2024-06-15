import { createStore } from "vuex";
import { sellers } from "./modules/sellers";
import { SellersState } from "./modules/sellers/types";

export interface RootState {
  sellers: SellersState;
}

const store = createStore<RootState>({
  modules: {
    sellers,
  },
});

export default store;
