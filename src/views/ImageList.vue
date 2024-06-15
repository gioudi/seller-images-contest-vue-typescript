<template>
  <article class="grid">
    <article v-if="loading" class="grid-col-sm-12">
      <!-- loading -->
      <LoadingFile></LoadingFile>
    </article>
    <article v-if="error" class="grid-col-sm-12">
      <!-- Error -->
      <ErrorFile></ErrorFile>
    </article>
    <article v-if="!loading && !error" class="grid-col-sm-12">
      <h2 class="alegra-h2">{{ searchTerm.toUpperCase() }}</h2>
      <div class="grid my-3">
        <div class="grid-col-sm-12">
          <input
            type="text"
            v-model="searchTerm"
            placeholder="Perros, Gatos ..."
          />
        </div>
        <div class="grid-col-sm-12">
          <button @click="handleGetNewImages">Buscar</button>
        </div>
      </div>
      <div class="grid">
        <div
          v-for="seller in sellerWithImages"
          :key="seller"
          class="grid-col-xs-12 grid-col-sm-12 grid-col-md-4 grid-col-lg-4"
        >
          <div class="alegra-card">
            <img
              class="image-container"
              :src="seller.image"
              :alt="seller.alt_description"
            />
            <div class="alegra-card__body">
              <h4 class="alegra-h4">
                {{ seller.name }} - {{ seller.points ?? 0 }} points
              </h4>
              <button
                class=""
                @click="handleUpdateSellerPoints(seller)"
                v-if="seller.clickable"
              >
                Like
              </button>
              <p v-else>Like it</p>
            </div>
          </div>
        </div>
      </div>
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
import { Seller } from "@/store/modules/sellers/types";
import { Image } from "@/store/modules/images/types";
import { computed, defineComponent, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";
import WinnerModal from "@/components/WinnerModal.vue";
export default defineComponent({
  name: "ImageList",
  components: {
    WinnerModal,
  },
  setup() {
    const store = useStore();
    const route = useRoute();
    const router = useRouter();
    const searchTerm = ref("");
    const loading = computed(() => store.getters["images/getLoading"]);
    const error = computed(() => store.getters["images/getError"]);
    const images = computed(() => store.getters["images/getImages"]);
    const sellers = computed(() => store.getters["sellers/getSellers"]);
    const contestEnded = computed(
      () => store.getters["sellers/getContestEnded"]
    );
    const winner = computed(() => store.getters["sellers/getWinner"]);

    /* Get Images */
    const handleGetImages = async () => {
      try {
        store.commit("images/FETCH_IMAGES_LOADING", true);
        searchTerm.value = route.query.q as string;
        await store.dispatch(`images/handleFetchImagesList`, searchTerm.value);
      } catch (error) {
        store.commit("images/FETCH_IMAGES_FAILURE", error);
      } finally {
        store.commit("images/FETCH_IMAGES_LOADING", false);
      }
    };

    /* Vote images */
    const handleUpdateSellerPoints = (seller: Seller) => {
      if (!contestEnded.value) {
        store.commit("sellers/UPDATE_SELLER_POINTS", {
          id: seller.id,
          points: 11,
        });
      }
    };

    /* Research for new Images */
    const handleGetNewImages = async () => {
      try {
        store.commit("images/FETCH_IMAGES_LOADING", true);
        await store.dispatch(`images/handleFetchImagesList`, searchTerm.value);
        store.commit("sellers/SET_CLICKABLE_SELLER");
      } catch (error) {
        store.commit("images/FETCH_IMAGES_FAILURE", error);
      } finally {
        store.commit("images/FETCH_IMAGES_LOADING", false);
      }
    };

    /*Handle continue */

    const handleContinue = () => {
      router.push({ name: "InvoiceForm" });
    };

    onMounted(() => {
      handleGetImages();
    });

    return {
      loading,
      error,
      searchTerm,
      sellerWithImages: computed(() => {
        return sellers.value.map((seller: Seller) => {
          const image = images.value.find(
            (img: Image, index: number) => index === seller.id
          );
          return {
            ...seller,
            points: seller.points,
            image: image ? image.urls.full : "",
            alt_description: image ? image.alt_description : "",
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
  height: 15.625rem;
  object-fit: cover;
}
</style>
