import { beforeEach, describe, expect, it, vi } from "vitest";
import { createPinia, setActivePinia } from "pinia";
import apiImagesService from "@/services/apiImagesService";

vi.mock("@/services/apiImagesService", () => ({
  default: { getImagesList: vi.fn() },
}));
vi.mock("@/utils/toastService", () => ({
  default: { showError: vi.fn(), showWarn: vi.fn() },
}));

import { useImages } from "@/composables/useImages";

const getImagesListMock = vi.mocked(apiImagesService.getImagesList);

describe("useImages", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    getImagesListMock.mockReset();
  });

  it("starts with empty images, idle loading and no error", () => {
    const { images, loading, error } = useImages();
    expect(images.value).toEqual([]);
    expect(loading.value).toBe(false);
    expect(error.value).toBeNull();
  });

  it("fetchImages calls the images service with the search term", async () => {
    const results = [
      { id: "1", urls: { full: "full-url" }, alt_description: "desc" },
    ];
    getImagesListMock.mockResolvedValue({
      response: { results },
    } as never);

    const { fetchImages, images } = useImages();
    await fetchImages("cute");

    expect(getImagesListMock).toHaveBeenCalledWith("cute");
    expect(images.value).toEqual(results);
  });
});
