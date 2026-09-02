import { shallowMount } from "@vue/test-utils";
import { vi } from "vitest";
import NavbarFile from "@/components/NavbarFile.vue";

const { pushMock } = vi.hoisted(() => ({ pushMock: vi.fn() }));

vi.mock("vue-router", () => ({
  useRouter: () => ({ push: pushMock }),
}));

describe("NavbarFile.vue", () => {
  it("renders the navbar title", () => {
    const wrapper = shallowMount(NavbarFile);
    expect(wrapper.find(".alegra-navbar-title").text()).toBe(
      "Imágenes del mundo"
    );
  });

  it("navigates home when the button is clicked", async () => {
    const wrapper = shallowMount(NavbarFile);
    await wrapper.find(".alegra-navbar-button").trigger("click");
    expect(pushMock).toHaveBeenCalledWith("/");
  });
});
