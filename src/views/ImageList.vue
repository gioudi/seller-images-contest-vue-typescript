<template>
  <article class="grid image-list">
    <article v-if="loading" class="grid-col-sm-12">
      <LoadingFile></LoadingFile>
    </article>
    <article v-else-if="error" class="grid-col-sm-12">
      <ErrorFile :message="error"></ErrorFile>
    </article>
    <article v-if="!loading && !error" class="grid-col-sm-12">
      <h1 class="h3 mb-4">{{ $t("results.title") }}</h1>
      <SearchBar :initial-term="initialTerm" @search="handleGetNewImages" />
      <SellerGrid
        :sellers="sellerWithImages"
        @vote="handleUpdateSellerPoints"
      />
    </article>
    <WinnerModal
      v-if="contestEnded"
      :show="contestEnded"
      :winner-name="winner?.name || ''"
      @proceed="handleContinue"
    />
  </article>
</template>

<script setup lang="ts">
import { computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useContest } from "@/composables/useContest";
import WinnerModal from "@/components/WinnerModal.vue";
import SearchBar from "@/components/search/SearchBar.vue";
import SellerGrid from "@/components/seller/SellerGrid.vue";
import LoadingFile from "../components/LoadingFile.vue";
import ErrorFile from "../components/ErrorFile.vue";

const route = useRoute();
const contest = useContest();
const initialTerm = computed(() => (route.query.q as string) ?? "");

onMounted(() => {
  contest.fetchInitialImages(initialTerm.value);
});

const handleGetNewImages = contest.searchNewImages;
const handleUpdateSellerPoints = contest.vote;
const handleContinue = contest.handleContinue;
</script>

<style lang="scss" scoped>
@import "../styles/abstracts/variables";

.image-list {
  & > .grid-col-sm-12 {
    padding: 0 1rem;
  }
}
</style>
