import { shallowMount } from "@vue/test-utils";
import { vi } from "vitest";
import NavbarFile from "@/components/NavbarFile.vue";
import { createTestI18n } from "./i18n";

const { pushMock } = vi.hoisted(() => ({ pushMock: vi.fn() }));

vi.mock("vue-router", () => ({
  useRouter: () => ({ push: pushMock }),
  useRoute: () => ({ name: "ImageList" }),
}));

describe("NavbarFile.vue", () => {
  it("renders the navbar title", () => {
    const wrapper = shallowMount(NavbarFile, {
      global: { plugins: [createTestI18n("es")] },
    });
    expect(wrapper.find(".alegra-navbar-title").text()).toBe(
      "Imágenes del mundo"
    );
  });

  it("navigates home when the button is clicked", async () => {
    const wrapper = shallowMount(NavbarFile, {
      global: { plugins: [createTestI18n("es")] },
    });
    await wrapper.find(".alegra-navbar-button").trigger("click");
    expect(pushMock).toHaveBeenCalledWith("/");
  });
});
