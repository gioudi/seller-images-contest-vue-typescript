import { defineStore } from "pinia";
import { Seller } from "./sellers/types";
import { CONTEST } from "@/config";
import apiService from "@/services/apiService";
import getErrorMessage from "@/utils/getErrorMessage";

export const useSellersStore = defineStore("sellers", {
  state: () => ({
    sellers: [] as Seller[],
    loading: false,
    error: null as string | null,
    contestEnded: false,
    winner: null as Seller | null,
  }),
  getters: {
    getSellers: (state) => state.sellers,
    getSellerById:
      (state) =>
      (id: number): Seller | undefined =>
        state.sellers.find((seller) => seller.id === id),
    getError: (state) => state.error,
    getLoading: (state) => state.loading,
    getContestEnded: (state) => state.contestEnded,
    getWinner: (state) => state.winner,
  },
  actions: {
    setLoading(loading: boolean) {
      this.loading = loading;
      this.error = null;
    },
    setFailure(error: string) {
      this.loading = false;
      this.error = error;
    },
    async handleFetchSellers() {
      this.setLoading(true);
      try {
        const response = await apiService.getSellers();
        this.sellers = response.map((seller: Seller) => ({
          ...seller,
          points: 0,
          clickable: true,
          contestEnded: false,
        }));
      } catch (error) {
        const errorMessage = getErrorMessage(error, "Error fetching sellers");
        this.setFailure(errorMessage);
      } finally {
        this.loading = false;
      }
    },
    updateSellerPoints(id: number, points: number) {
      const seller = this.sellers.find((vendor) => vendor.id === id);
      if (seller) {
        seller.points += points;
        if (seller.points >= CONTEST.WIN_THRESHOLD) {
          this.contestEnded = true;
          this.winner = seller;
        }
        seller.clickable = false;
      }
    },
    setClickableSeller() {
      this.sellers = this.sellers.map((seller) => ({
        ...seller,
        clickable: true,
      }));
    },
  },
});
