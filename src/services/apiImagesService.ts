import toastService from "@/utils/toastService";
import { createApi } from "unsplash-js";

const accessKey = process.env.VUE_APP_UNSPLASH_ACCESS_KEY || "";

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
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Error fetching images";
      toastService.showError(errorMessage);

      throw new Error(errorMessage);
    }
  },
};

export default apiServiceImages;
