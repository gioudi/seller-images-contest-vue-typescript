import { Image, ImagesState } from "./types";

const mutations = {
  SET_IMAGES(state: ImagesState, images: Image[]) {
    state.images = images;
  },
  FETCH_IMAGES_LOADING(state: ImagesState, loading: boolean) {
    state.loading = loading;
    state.error = null;
  },
  FETCH_IMAGES_FAILURE(state: ImagesState, error: string) {
    state.loading = false;
    state.error = error;
  },
};

export default mutations;
