<template>
  <article class="grid landing">
    <article v-if="loading" class="grid-col-xs-12">
      <LoadingFile></LoadingFile>
    </article>
    <article v-else-if="error" class="grid-col-xs-12">
      <ErrorFile :message="error"></ErrorFile>
    </article>

    <template v-if="!loading && !error">
      <article class="grid-col-xs-12 grid-col-lg-6 landing__intro">
        <h1 class="h3 mt-3 mb-3">{{ $t("landing.title") }}</h1>
        <p class="mb-4 landing__subtitle">
          {{ $t("landing.subtitle") }}
        </p>
        <form class="landing__search" @submit.prevent="searchImages">
          <label for="searchTerm" class="mb-2 d-block">
            {{ $t("landing.label") }}
          </label>
          <div class="landing__search-row">
            <input
              id="searchTerm"
              v-model="searchTerm"
              type="text"
              class="form-control"
              :placeholder="$t('common.searchPlaceholder')"
              required
            />
            <button type="submit" class="btn btn-primary landing__submit">
              {{ $t("common.search") }}
            </button>
          </div>
        </form>
      </article>

      <article
        v-if="images && images.length"
        class="grid-col-xs-12 grid-col-lg-6"
      >
        <CarouselFile :images="images" />
      </article>
    </template>
  </article>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import CarouselFile from "../components/CarouselFile.vue";
import LoadingFile from "../components/LoadingFile.vue";
import ErrorFile from "../components/ErrorFile.vue";
import { useImages } from "@/composables/useImages";
import toastService from "@/utils/toastService";

const { t } = useI18n();
const searchTerm = ref("");
const router = useRouter();
const { images, loading, error } = useImages();

const searchImages = () => {
  if (searchTerm.value.trim()) {
    router.push({
      name: "ImageList",
      query: { q: searchTerm.value.trim() },
    });
  } else {
    toastService.showWarn(t("landing.emptyQuery"));
  }
};
</script>

<style lang="scss" scoped>
@import "../styles/abstracts/variables";

.landing {
  &__intro {
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 1rem;
  }

  &__subtitle {
    color: $color-medium;
    font-size: $font-size-normal;
    line-height: 1.6;
  }

  &__search-row {
    display: flex;
    gap: 0.5rem;
    align-items: stretch;

    input {
      flex: 1;
    }

    .landing__submit {
      flex: 0 0 auto;
    }
  }
}
</style>
