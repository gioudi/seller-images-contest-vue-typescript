import { ActionContext } from "vuex";
import { AxiosError } from "axios";
import { RootState } from "@/store";
import apiService from "@/services/apiImagesService";
import toastService from "@/utils/toastService";
import { ImagesState } from "./types";

type ImagesActionContext = ActionContext<ImagesState, RootState>;

const actions = {
  async handleFetchImagesList(
    { commit }: ImagesActionContext,
    payload: string
  ) {
    commit("FETCH_IMAGES_LOADING", true);

    try {
      const response = await apiService.getImagesList(payload);
      commit("SET_IMAGES", response.response?.results);
    } catch (error) {
      const errorMessage =
        error instanceof AxiosError
          ? error.response?.data?.message ?? "Error fetching images"
          : error instanceof Error
          ? error.message
          : "Error fetching images";
      commit("FETCH_IMAGES_FAILURE", errorMessage);
      toastService.showError(errorMessage);
    } finally {
      commit("FETCH_IMAGES_LOADING", false);
    }
  },
};

export default actions;
