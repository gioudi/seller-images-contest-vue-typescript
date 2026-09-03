import { shallowMount } from "@vue/test-utils";
import FooterFile from "@/components/FooterFile.vue";
import { createTestI18n } from "./i18n";

describe("FooterFile.vue", () => {
  it("renders the copyright footer", () => {
    const wrapper = shallowMount(FooterFile, {
      global: { plugins: [createTestI18n("en")] },
    });
    expect(wrapper.find(".footer").text()).toContain("All rights reserved.");
  });
});
