import { beforeEach, describe, expect, it, vi } from "vitest";
import { createPinia, setActivePinia } from "pinia";
import apiService from "@/services/apiService";

vi.mock("@/services/apiService", () => ({
  default: { getSellers: vi.fn(), createInvoice: vi.fn() },
}));
vi.mock("@/utils/toastService", () => ({
  default: { showError: vi.fn(), showWarn: vi.fn() },
}));

import { useSellers } from "@/composables/useSellers";
import { useSellersStore } from "@/stores/sellersStore";

describe("useSellers", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.mocked(apiService.getSellers).mockReset();
  });

  it("starts with empty sellers and idle contest state", () => {
    const { sellers, contestEnded, winner, loading, error } = useSellers();
    expect(sellers.value).toEqual([]);
    expect(contestEnded.value).toBe(false);
    expect(winner.value).toBeNull();
    expect(loading.value).toBe(false);
    expect(error.value).toBeNull();
  });

  it("vote adds points and makes the seller not clickable", () => {
    const store = useSellersStore();
    store.sellers = [{ id: 1, name: "A", points: 0, clickable: true }];

    const { vote, contestEnded } = useSellers();
    vote(store.sellers[0]);

    expect(store.sellers[0].points).toBe(3);
    expect(store.sellers[0].clickable).toBe(false);
    expect(contestEnded.value).toBe(false);
  });

  it("victory ends the contest and sets the winner once the threshold is reached", () => {
    const store = useSellersStore();
    store.sellers = [{ id: 1, name: "A", points: 18, clickable: true }];

    const { vote, contestEnded, winner } = useSellers();
    vote(store.sellers[0]);

    expect(store.sellers[0].points).toBe(21);
    expect(contestEnded.value).toBe(true);
    expect(winner.value?.id).toBe(1);
  });

  it("does not change points once the contest has ended", () => {
    const store = useSellersStore();
    store.sellers = [{ id: 1, name: "A", points: 21, clickable: false }];
    store.contestEnded = true;

    const { vote } = useSellers();
    vote(store.sellers[0]);

    expect(store.sellers[0].points).toBe(21);
  });

  it("resetClickable makes every seller clickable again", () => {
    const store = useSellersStore();
    store.sellers = [
      { id: 1, name: "A", points: 3, clickable: false },
      { id: 2, name: "B", points: 0, clickable: false },
    ];

    const { resetClickable } = useSellers();
    resetClickable();

    expect(store.sellers.every((seller) => seller.clickable)).toBe(true);
  });
});
