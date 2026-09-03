import { beforeEach, describe, expect, it } from "vitest";
import { createPinia, setActivePinia } from "pinia";
import { useError } from "@/composables/useError";
import { useImagesStore } from "@/stores/imagesStore";

describe("useError", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it("reflects the store error state reactively", () => {
    const store = useImagesStore();
    const error = useError(store);

    expect(error.value).toBeNull();

    store.error = "Something went wrong";
    expect(error.value).toBe("Something went wrong");
  });
});
