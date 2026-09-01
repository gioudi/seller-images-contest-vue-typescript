import { beforeEach, describe, expect, it, vi } from "vitest";
import { createPinia, setActivePinia } from "pinia";

const serviceMocks = vi.hoisted(() => ({
  getImagesList: vi.fn(),
  getSellers: vi.fn(),
  createInvoice: vi.fn(),
}));

vi.mock("@/services/apiImagesService", () => ({
  default: { getImagesList: serviceMocks.getImagesList },
}));
vi.mock("@/services/apiService", () => ({
  default: serviceMocks,
}));
vi.mock("@/utils/toastService", () => ({
  default: { showError: vi.fn(), showWarn: vi.fn() },
}));
const push = vi.fn();
vi.mock("vue-router", () => ({
  useRouter: () => ({ push }),
}));

import { useContest } from "@/composables/useContest";
import { useSellersStore } from "@/stores/sellersStore";
import { useImagesStore } from "@/stores/imagesStore";

describe("useContest", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    serviceMocks.getImagesList.mockReset();
    serviceMocks.getSellers.mockReset();
    push.mockReset();
  });

  it("matches each seller to an image", () => {
    const sellersStore = useSellersStore();
    const imagesStore = useImagesStore();

    imagesStore.images = [
      { id: "pic-a", urls: { small: "small-a" }, alt_description: "photo a" },
      { id: "pic-b", urls: { small: "small-b" }, alt_description: "photo b" },
    ];
    sellersStore.sellers = [
      { id: 1, name: "A", points: 0, clickable: true },
      { id: 2, name: "B", points: 0, clickable: true },
    ];

    const { sellerWithImages } = useContest();

    expect(sellerWithImages.value).toHaveLength(2);
    expect(sellerWithImages.value[0].image).toBe("small-b");
    expect(sellerWithImages.value[0].alt_description).toBe("photo b");
    expect(sellerWithImages.value[1].image).toBe("small-a");
  });

  it("uses a placeholder image when there are no images", () => {
    const sellersStore = useSellersStore();
    sellersStore.sellers = [{ id: 1, name: "A", points: 0, clickable: true }];

    const { sellerWithImages } = useContest();

    expect(sellerWithImages.value[0].image).toBe(
      "https://via.placeholder.com/400x400?text=Sin+imagen"
    );
    expect(sellerWithImages.value[0].alt_description).toBe(
      "Imagen del concurso"
    );
  });

  it("handleContinue routes to the invoice form with the winner id", () => {
    const sellersStore = useSellersStore();
    sellersStore.winner = { id: 7, name: "A", points: 20, clickable: false };
    sellersStore.contestEnded = true;

    const { handleContinue } = useContest();
    handleContinue();

    expect(push).toHaveBeenCalledWith({
      name: "InvoiceForm",
      query: { q: 7 },
    });
  });

  it("searchNewImages fetches images and makes sellers clickable again", async () => {
    const sellersStore = useSellersStore();
    sellersStore.sellers = [{ id: 1, name: "A", points: 3, clickable: false }];

    const results = [{ id: "1", urls: { small: "u" }, alt_description: "d" }];
    serviceMocks.getImagesList.mockResolvedValue({
      response: { results },
    });

    const { searchNewImages } = useContest();
    await searchNewImages("tech");

    expect(sellersStore.sellers[0].clickable).toBe(true);
  });
});
