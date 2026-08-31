import { shallowMount } from "@vue/test-utils";
import LoadingFile from "@/components/LoadingFile.vue";

describe("LoadingFile.vue", () => {
  it("renders the processing message", () => {
    const wrapper = shallowMount(LoadingFile);
    expect(wrapper.find(".alegra-loading").text()).toContain("Procesando");
  });
});
