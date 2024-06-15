import { Module } from "vuex";
import { ImagesState } from "./types";
import { RootState } from "@/store";
import state from "./state";
import mutations from "./mutations";
import actions from "./actions";
import getters from "./getters";

export const images: Module<ImagesState, RootState> = {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
