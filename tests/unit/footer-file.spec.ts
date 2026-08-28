import { shallowMount } from "@vue/test-utils";
import FooterFile from "@/components/FooterFile.vue";

describe("FooterFile.vue", () => {
  it("renders the copyright footer", () => {
    const wrapper = shallowMount(FooterFile);
    expect(wrapper.find(".footer").text()).toContain("All rights reserved.");
  });
});
