<template>
  <Carousel :items-to-show="1" class="alegra-carousel">
    <Slide
      v-for="(image, index) in images"
      :key="index"
      class="alegra-carousel__slide"
    >
      <img :src="image.urls.small" :alt="image.slug" />
    </Slide>
    <template #addons>
      <Navigation />
      <Pagination />
    </template>
  </Carousel>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import { Carousel, Slide, Pagination, Navigation } from "vue3-carousel";
import "vue3-carousel/dist/carousel.css";

interface ImageSlide {
  urls: {
    small: string;
  };
  slug: string;
}

export default defineComponent({
  name: "CarouselFile",
  components: { Carousel, Slide, Pagination, Navigation },
  props: {
    images: {
      type: Array as PropType<ImageSlide[]>,
      required: true,
      validator: (images: ImageSlide[]) => {
        return images.every(
          (image) => image.urls && image.urls.small && image.slug
        );
      },
    },
  },
});
</script>
<style lang="scss">
@import "../styles/variables";
</style>
