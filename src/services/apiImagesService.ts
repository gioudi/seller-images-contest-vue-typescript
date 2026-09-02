import getErrorMessage from "@/utils/getErrorMessage";
import { createApi } from "unsplash-js";
import toastService from "@/utils/toastService";

const accessKey = import.meta.env.VITE_UNSPLASH_ACCESS_KEY || "";

const unsplash = createApi({
  accessKey,
});

const apiServiceImages = {
  async getImagesList(payload: string) {
    try {
      const response = await unsplash.search.getPhotos({
        query: payload,
        orientation: "landscape",
      });
      return response;
    } catch (error) {
      const errorMessage = getErrorMessage(error, "Error fetching images");
      toastService.showError(errorMessage);

      throw new Error(errorMessage);
    }
  },
};

export default apiServiceImages;
