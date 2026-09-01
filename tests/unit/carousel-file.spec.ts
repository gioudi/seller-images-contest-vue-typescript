import { shallowMount } from "@vue/test-utils";
import CarouselFile from "@/components/CarouselFile.vue";

interface CarouselPropsShape {
  images: {
    validator: (value: unknown[]) => boolean;
  };
}

const carouselProps = (
  CarouselFile as unknown as {
    props: CarouselPropsShape;
  }
).props;

describe("CarouselFile.vue", () => {
  const images = [
    { urls: { small: "https://example.com/a.jpg" }, slug: "slug-a" },
    { urls: { small: "https://example.com/b.jpg" }, slug: "slug-b" },
  ];

  it("receives and validates the images prop", () => {
    const wrapper = shallowMount(CarouselFile, {
      props: { images },
    });
    expect((wrapper.props() as Record<string, unknown>).images).toHaveLength(2);
    expect(carouselProps.images.validator(images)).toBe(true);
  });

  it("rejects images without a small url", () => {
    const invalid = [{ urls: {}, slug: "broken" }];
    expect(carouselProps.images.validator(invalid)).toBe(false);
  });
});
