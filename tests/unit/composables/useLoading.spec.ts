import { beforeEach, describe, expect, it } from "vitest";
import { createPinia, setActivePinia } from "pinia";
import { useLoading } from "@/composables/useLoading";
import { useImagesStore } from "@/stores/imagesStore";

describe("useLoading", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it("reflects the store loading state reactively", () => {
    const store = useImagesStore();
    const loading = useLoading(store);

    expect(loading.value).toBe(false);

    store.loading = true;
    expect(loading.value).toBe(true);

    store.loading = false;
    expect(loading.value).toBe(false);
  });
});
