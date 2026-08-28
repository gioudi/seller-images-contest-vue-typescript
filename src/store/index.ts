import { createStore } from "vuex";
import { sellers } from "./modules/sellers";
import { images } from "./modules/images";
import { invoices } from "./modules/invoices";
import { RootState } from "./types";

export { RootState } from "./types";

const store = createStore<RootState>({
  modules: {
    sellers,
    images,
    invoices,
  },
});

export default store;
