<template>
  <article class="grid">
    <article v-if="loading" class="grid-col-sm-12">
      <LoadingFile></LoadingFile>
    </article>
    <article v-else-if="error" class="grid-col-sm-12">
      <ErrorFile :message="error"></ErrorFile>
    </article>
    <article v-if="!loading && !error" class="grid-col-sm-12">
      <h5 class="mb-4 mt-3">Lista de Imágenes que Inspiran</h5>
      <SearchBar :initial-term="initialTerm" @search="handleGetNewImages" />
      <SellerGrid
        :sellers="sellerWithImages"
        @vote="handleUpdateSellerPoints"
      />
    </article>
    <WinnerModal
      v-if="contestEnded"
      :show="contestEnded"
      :winnerName="winner?.name || ''"
      @proceed="handleContinue"
    />
  </article>
</template>
<script lang="ts">
import { Seller } from "@/stores/sellers/types";
import { computed, defineComponent, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useImagesStore } from "@/stores/imagesStore";
import { useSellersStore } from "@/stores/sellersStore";
import { CONTEST, IMAGES } from "@/config";
import getErrorMessage from "@/utils/getErrorMessage";
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
    const imagesStore = useImagesStore();
    const sellersStore = useSellersStore();
    const route = useRoute();
    const router = useRouter();
    const loading = computed(() => imagesStore.getLoading);
    const error = computed(() => imagesStore.getError);
    const images = computed(() => imagesStore.getImages);
    const sellers = computed(() => sellersStore.getSellers);
    const contestEnded = computed(() => sellersStore.getContestEnded);
    const winner = computed(() => sellersStore.getWinner);
    const initialTerm = computed(() => (route.query.q as string) ?? "");

    /* Get Images */
    const handleGetImages = async () => {
      try {
        imagesStore.setLoading(true);

        await imagesStore.fetchImagesList(initialTerm.value);
      } catch (error) {
        imagesStore.setFailure(getErrorMessage(error, "Error fetching images"));
      } finally {
        imagesStore.setLoading(false);
      }
    };

    /* Vote images */
    const handleUpdateSellerPoints = (seller: Seller) => {
      if (!contestEnded.value) {
        sellersStore.updateSellerPoints(seller.id, CONTEST.VOTE_POINTS);
      }
    };

    /* Research for new Images */
    const handleGetNewImages = async (term: string) => {
      try {
        imagesStore.setLoading(true);
        await imagesStore.fetchImagesList(term);
        sellersStore.setClickableSeller();
      } catch (error) {
        imagesStore.setFailure(getErrorMessage(error, "Error fetching images"));
      } finally {
        imagesStore.setLoading(false);
      }
    };

    /*Handle continue */

    const handleContinue = () => {
      router.push({
        name: "InvoiceForm",
        query: { q: winner?.value?.id },
      });
    };

    onMounted(() => {
      handleGetImages();
    });

    return {
      loading,
      error,
      initialTerm,
      sellerWithImages: computed(() => {
        const totalImages = images.value.length;
        return sellers.value.map((seller: Seller) => {
          const image =
            totalImages > 0 ? images.value[seller.id % totalImages] : undefined;
          return {
            ...seller,
            points: seller.points,
            image: image ? image.urls.full : IMAGES.FALLBACK_URL,
            alt_description: image
              ? image.alt_description
              : "Imagen del concurso",
          };
        });
      }),
      handleUpdateSellerPoints,
      handleGetNewImages,
      contestEnded,
      winner,
      handleContinue,
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
