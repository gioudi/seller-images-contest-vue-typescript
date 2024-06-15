import apiService from "@/services/apiImagesService";
import toastService from "@/utils/toastService";

const actions = {
  async handleFetchImagesList({ commit }: any, payload: string) {
    commit("FETCH_IMAGES_LOADING", true);

    try {
      const response = await apiService.getImagesList(payload);
      commit("SET_IMAGES", response.response?.results);
    } catch (error: any) {
      commit("FETCH_IMAGES_FAILURE", error.message);
      const errorMessage =
        error.response?.data?.message || "Error fetching images";
      toastService.showError(errorMessage);
    } finally {
      commit("FETCH_IMAGES_LOADING", false);
    }
  },
};

export default actions;
