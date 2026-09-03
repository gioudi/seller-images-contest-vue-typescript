import { shallowMount } from "@vue/test-utils";
import LoadingFile from "@/components/LoadingFile.vue";
import { createTestI18n } from "./i18n";

describe("LoadingFile.vue", () => {
  it("renders the processing message", () => {
    const wrapper = shallowMount(LoadingFile, {
      global: { plugins: [createTestI18n("es")] },
    });
    expect(wrapper.find(".alegra-loading").text()).toContain("Procesando");
  });
});
