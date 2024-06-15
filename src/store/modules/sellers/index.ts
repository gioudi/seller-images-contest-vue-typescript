import { Module } from "vuex";
import { SellersState } from "./types";
import { RootState } from "@/store";
import state from "./state";
import mutations from "./mutations";
import actions from "./actions";
import getters from "./getters";

export const sellers: Module<SellersState, RootState> = {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
