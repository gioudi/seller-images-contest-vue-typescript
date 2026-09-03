import { defineStore } from "pinia";
import { Image } from "./images/types";
import apiService from "@/services/apiImagesService";
import toastService from "@/utils/toastService";
import getErrorMessage from "@/utils/getErrorMessage";

export const useImagesStore = defineStore("images", {
  state: () => ({
    images: [] as Image[],
    loading: false,
    error: null as string | null,
    hasSearched: false,
  }),
  getters: {
    getImages: (state) => state.images,
    getError: (state) => state.error,
    getLoading: (state) => state.loading,
    getHasSearched: (state) => state.hasSearched,
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
    async fetchImagesList(query: string) {
      this.setLoading(true);
      try {
        const response = await apiService.getImagesList(query);
        this.images = (response.response?.results ?? []) as unknown as Image[];
      } catch (error) {
        const errorMessage = getErrorMessage(error, "Error fetching images");
        this.setFailure(errorMessage);
        toastService.showError(errorMessage);
      } finally {
        this.loading = false;
        this.hasSearched = true;
      }
    },
  },
});
