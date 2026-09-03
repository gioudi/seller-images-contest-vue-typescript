<template>
  <section class="alegra-card">
    <img
      class="alegra-card__image"
      :src="seller.image"
      :alt="seller.alt_description"
      loading="lazy"
    />
    <div class="alegra-card__body">
      <h2 class="alegra-card__title">
        {{ seller.name }}
      </h2>
      <p class="alegra-card__points">
        {{ t("contest.points", { n: seller.points ?? 0 }) }}
      </p>
    </div>
    <button
      v-if="seller.clickable"
      class="alegra-card__vote"
      type="button"
      @click="emitVote"
    >
      {{ t("common.vote") }}
    </button>
    <p v-else class="alegra-card__voted">{{ t("common.voted") }}</p>
  </section>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";

interface SellerCardData {
  name: string;
  points: number;
  clickable: boolean;
  image: string;
  alt_description: string;
}

const props = defineProps<{
  seller: SellerCardData;
}>();

const emit = defineEmits<{
  (e: "vote", seller: SellerCardData): void;
}>();

const { t } = useI18n();
const emitVote = () => emit("vote", props.seller);
</script>

<style lang="scss" scoped>
@import "../../styles/abstracts/variables";
@import "../../styles/abstracts/mixins";

.alegra-card {
  display: flex;
  flex-direction: column;
  background: $surface-color;
  border-radius: $border-radius-md;
  box-shadow: $box-shadow-md;
  overflow: hidden;
  text-align: center;
  height: 100%;

  &__image {
    width: 100%;
    height: 10rem;
    object-fit: cover;
    border-radius: 0;
  }

  &__body {
    padding: 0.75rem 1rem;
  }

  &__title {
    font-size: $font-size-h6;
    font-weight: 700;
    color: $color-dark;
    margin-bottom: 0.25rem;
  }

  &__points {
    font-size: $font-size-small;
    color: $color-medium;
  }

  &__vote {
    margin: 0 1rem 1rem;
    @include alegra-button();
  }

  &__voted {
    margin: 0 1rem 1rem;
    font-size: $font-size-small;
    color: $accent-color;
    font-weight: 600;
  }
}
</style>
