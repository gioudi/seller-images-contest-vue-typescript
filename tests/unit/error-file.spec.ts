import { shallowMount } from "@vue/test-utils";
import ErrorFile from "@/components/ErrorFile.vue";

const errorProps = (
  ErrorFile as unknown as {
    props: { message: { required: boolean } };
  }
).props;

describe("ErrorFile.vue", () => {
  it("renders the error message prop", () => {
    const wrapper = shallowMount(ErrorFile, {
      props: { message: "No se pudo cargar" },
    });
    expect(wrapper.find(".error").text()).toContain("No se pudo cargar");
  });

  it("is required to receive a message prop", () => {
    expect(errorProps.message.required).toBe(true);
  });
});
