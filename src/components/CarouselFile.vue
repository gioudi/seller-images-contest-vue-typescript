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

<script setup lang="ts">
import { Carousel, Slide, Pagination, Navigation } from "vue3-carousel";
import "vue3-carousel/dist/carousel.css";

interface ImageSlide {
  urls: {
    small: string;
  };
  slug: string;
}

defineProps({
  images: {
    type: Array as import("vue").PropType<ImageSlide[]>,
    required: true,
    validator: (images: ImageSlide[]) =>
      images.every((image) => image.urls && image.urls.small && image.slug),
  },
});
</script>

<style lang="scss" scoped>
@import "../styles/abstracts/variables";

.alegra-carousel__slide {
  img {
    width: 100%;
    border-radius: $border-radius-md;
    object-fit: cover;
    box-shadow: $box-shadow-md;
  }
}
</style>
