import { createStore } from "vuex";
import { sellers } from "./modules/sellers";
import { SellersState } from "./modules/sellers/types";
import { images } from "./modules/images";
import { invoices } from "./modules/invoices";

export interface RootState {
  sellers: SellersState;
}

const store = createStore<RootState>({
  modules: {
    sellers,
    images,
    invoices,
  },
});

export default store;
