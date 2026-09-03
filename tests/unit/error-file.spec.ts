import { shallowMount } from "@vue/test-utils";
import ErrorFile from "@/components/ErrorFile.vue";
import { createTestI18n } from "./i18n";

const errorProps = (
  ErrorFile as unknown as {
    props: { message: { required: boolean } };
  }
).props;

describe("ErrorFile.vue", () => {
  it("renders the error message prop", () => {
    const wrapper = shallowMount(ErrorFile, {
      props: { message: "No se pudo cargar" },
      global: { plugins: [createTestI18n("es")] },
    });
    expect(wrapper.find(".error").text()).toContain("No se pudo cargar");
  });

  it("is required to receive a message prop", () => {
    expect(errorProps.message.required).toBe(true);
  });
});
