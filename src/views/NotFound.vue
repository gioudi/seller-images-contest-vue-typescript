<template>
  <article class="grid not-found">
    <article class="grid-col-xs-12 grid-col-md-6 not-found__content">
      <h1 class="h1 mb-3">
        <span class="not-found__code">404</span>
      </h1>
      <p class="h4 mb-3">{{ $t("notFound.title") }}</p>
      <p class="mb-4">{{ $t("notFound.message") }}</p>
      <button class="btn btn-primary" @click="goHome">
        {{ $t("notFound.goHome") }}
      </button>
    </article>
  </article>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";

const router = useRouter();
const goHome = () => router.push("/");
</script>

<style lang="scss" scoped>
@import "../styles/abstracts/variables";

.not-found {
  text-align: center;
  justify-content: center;

  &__content {
    padding: 3rem 1rem;
  }

  &__code {
    font-size: $font-size-h1;
    font-weight: 900;
    color: $color-primary-50;
  }
}
</style>
