import { Module } from "vuex";
import { InvoicesState } from "./types";
import { RootState } from "@/store";
import state from "./state";
import mutations from "./mutations";
import actions from "./actions";

export const invoices: Module<InvoicesState, RootState> = {
  namespaced: true,
  state,
  mutations,
  actions,
};
