<template>
  <article class="grid">
    <article v-if="loading" class="grid-col-sm-12">
      <LoadingFile></LoadingFile>
    </article>
    <article v-else-if="error" class="grid-col-sm-12">
      <ErrorFile :message="error"></ErrorFile>
    </article>
    <article v-if="!loading && !error" class="grid-col-sm-12">
      <h1 class="h5 mb-4 mt-3">Lista de Imágenes que Inspiran</h1>
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
<script lang="ts">
import { computed, defineComponent, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useContest } from "@/composables/useContest";
import WinnerModal from "@/components/WinnerModal.vue";
import SearchBar from "@/components/search/SearchBar.vue";
import SellerGrid from "@/components/seller/SellerGrid.vue";
import LoadingFile from "../components/LoadingFile.vue";
import ErrorFile from "../components/ErrorFile.vue";
export default defineComponent({
  name: "ImageList",
  components: {
    WinnerModal,
    SearchBar,
    SellerGrid,
    LoadingFile,
    ErrorFile,
  },
  setup() {
    const route = useRoute();
    const contest = useContest();
    const initialTerm = computed(() => (route.query.q as string) ?? "");

    onMounted(() => {
      contest.fetchInitialImages(initialTerm.value);
    });

    return {
      loading: contest.loading,
      error: contest.error,
      initialTerm,
      sellerWithImages: contest.sellerWithImages,
      handleGetNewImages: contest.searchNewImages,
      handleUpdateSellerPoints: contest.vote,
      contestEnded: contest.contestEnded,
      winner: contest.winner,
      handleContinue: contest.handleContinue,
    };
  },
});
</script>

<style lang="scss" scoped>
.image-container {
  width: 100%;
  display: flex;
  height: 10.625rem;
  object-fit: cover;
}
</style>
