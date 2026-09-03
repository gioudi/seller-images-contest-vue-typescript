import { beforeEach, describe, expect, it, vi } from "vitest";
import { createPinia, setActivePinia } from "pinia";

const imageServiceMock = vi.hoisted(() => ({
  getImagesList: vi.fn(),
}));

vi.mock("@/services/apiImagesService", () => ({
  default: imageServiceMock,
}));
vi.mock("@/utils/toastService", () => ({
  default: { showError: vi.fn(), showWarn: vi.fn() },
}));

import { useImages } from "@/composables/useImages";

describe("useImages", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    imageServiceMock.getImagesList.mockReset();
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
    imageServiceMock.getImagesList.mockResolvedValue({
      response: { results },
    });

    const { fetchImages, images } = useImages();
    await fetchImages("cute");

    expect(imageServiceMock.getImagesList).toHaveBeenCalledWith("cute");
    expect(images.value).toEqual(results);
  });

  it("tracks that a search has been performed once it completes", async () => {
    imageServiceMock.getImagesList.mockResolvedValue({
      response: { results: [] },
    });

    const { fetchImages, hasSearched } = useImages();
    expect(hasSearched.value).toBe(false);

    await fetchImages("cute");

    expect(hasSearched.value).toBe(true);
  });
});
