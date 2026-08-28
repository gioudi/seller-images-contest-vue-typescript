import { shallowMount } from "@vue/test-utils";
import NavbarFile from "@/components/NavbarFile.vue";

describe("NavbarFile.vue", () => {
  it("renders the navbar title", () => {
    const wrapper = shallowMount(NavbarFile);
    expect(wrapper.find(".alegra-navbar-title").text()).toBe(
      "Imágenes del mundo"
    );
  });

  it("navigates home when the button is clicked", async () => {
    const push = jest.fn();
    const wrapper = shallowMount(NavbarFile, {
      global: {
        mocks: {
          $router: { push },
        },
      },
    });
    await wrapper.find(".alegra-navbar-button").trigger("click");
    expect(push).toHaveBeenCalledWith("/");
  });
});
