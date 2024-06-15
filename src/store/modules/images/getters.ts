import { Image, ImagesState } from "./types";

const getters = {
  getImages(state: ImagesState): Image[] {
    return state.images;
  },
  getError: (state: ImagesState) => state.error,
  getLoading: (state: ImagesState) => state.loading,
};

export default getters;
