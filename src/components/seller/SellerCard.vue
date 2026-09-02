<template>
  <section class="alegra-card-container">
    <div class="alegra-card p-1">
      <h2 class="alegra-card__title">
        {{ seller.name }}-{{ seller.points ?? 0 }} puntos
      </h2>
      <button
        v-if="seller.clickable"
        class="mt-3"
        type="button"
        @click="emitVote"
      >
        Votar
      </button>
      <p v-else>Votado</p>
      <img
        class="alegra-card__image"
        :src="seller.image"
        :alt="seller.alt_description"
        loading="lazy"
      />
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";

interface SellerCardData {
  name: string;
  points: number;
  clickable: boolean;
  image: string;
  alt_description: string;
}

export default defineComponent({
  name: "SellerCard",
  props: {
    seller: {
      type: Object as PropType<SellerCardData>,
      required: true,
    },
  },
  emits: ["vote"],
  setup(props, { emit }) {
    const emitVote = () => emit("vote", props.seller);

    return { emitVote };
  },
});
</script>

<style lang="scss" scoped>
@import "../../styles/abstracts/variables";

.alegra-card-container {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 12rem;
  height: 14.125rem;
  border-radius: $border-radius-md;
  transform-style: preserve-3d;

  &:hover {
    .alegra-card {
      width: 8.75rem;
      height: 12rem;
      transition: 0.5s ease;
      &::before {
        background-size: 150% 100%;
        clip-path: circle(70% at right 100%);
      }
    }
    .alegra-card__title {
      opacity: 1;
      transition: 0.5s;
      transform: translate3d(0, 0, 1.5625rem) rotate(-10deg);
    }
    .alegra-card__image {
      max-height: 8.75rem;
      transform: translate3d(10%, -50%, 15px);
    }
  }

  .alegra-card {
    position: relative;
    width: 8.75rem;
    height: 12rem;
    background: $color-dark;
    border-radius: $border-radius-md;
    transform-style: preserve-3d;
    transition: 0.5s ease;

    &::before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(
        -45deg,
        $color-primary-20 15%,
        $color-primary-70 86%
      );
      background-size: 100% 150%;
      clip-path: circle(55% at right 100%);
      box-shadow: $box-shadow-md;
      transform-style: preserve-3d;
      transform: translate3d(0, 0, 0);
      transition: 0.5s ease;
    }
    &__title {
      position: absolute;
      text-align: center;
      top: 2.5625rem;
      transform-style: preserve-3d;
      transform: translate3d(0, 0, 50px) rotate(0deg);
      font-size: $font-size-h6;
      font-weight: 900;
      color: transparent;
      -webkit-text-stroke: 1px $color-white;
      font-style: italic;
      opacity: 0;
      transition: 0.25s ease;
    }
    &__image {
      position: absolute;
      top: 48%;
      left: 50%;
      max-height: 6.25rem;
      z-index: 11;
      transform-style: preserve-3d;
      transform: translate3d(-25%, -50%, 50px) rotate(0deg);
      transition: 0.5s;
    }
  }
}
</style>
