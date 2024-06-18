<template>
  <article class="grid">
    <article v-if="loading" class="grid-col-sm-12">
      <!-- loading -->
      <LoadingFile></LoadingFile>
    </article>
    <article v-else-if="error" class="grid-col-sm-12">
      <!-- Error -->
      <ErrorFile :message="error"></ErrorFile>
    </article>
    <article v-if="!loading && !error" class="grid-col-sm-12">
      <h5 class="mb-4 mt-3">Lista de Imágenes que Inspiran</h5>
      <form @submit.prevent="handleGetNewImages">
        <label for="searchTerm" class="d-flex mb-3"
          >¿Quieres buscar algo nuevo?
        </label>
        <input
          type="text"
          id="searchTerm"
          class="d-flex form-control"
          v-model="searchTerm"
          placeholder="Buscar imágenes"
          required
        />
        <button type="submit" class="btn btn-primary my-3">Buscar</button>
      </form>
      <div class="grid">
        <div
          v-for="seller in sellerWithImages"
          :key="seller"
          class="grid-col-xs-11 grid-col-sm-12 grid-col-md-4 grid-col-lg-4"
        >
          <section class="alegra-card-container">
            <div class="alegra-card p-1">
              <h4 class="alegra-card__title">
                {{ seller.name }}-{{ seller.points ?? 0 }} puntos
              </h4>
              <button
                class="mt-3"
                @click="handleUpdateSellerPoints(seller)"
                v-if="seller.clickable"
              >
                Votar
              </button>
              <p v-else>Votado</p>
              <img
                class="alegra-card__image"
                :src="seller.image"
                :alt="seller.alt_description"
              />
            </div>
          </section>
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
import LoadingFile from "../components/LoadingFile.vue";
import ErrorFile from "../components/ErrorFile.vue";
export default defineComponent({
  name: "ImageList",
  components: {
    WinnerModal,
    LoadingFile,
    ErrorFile,
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

        searchTerm.value = (route.query.q as string) ?? "";
        await new Promise((resolve) => setTimeout(resolve, 3000));
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
          points: 3,
        });
      }
    };

    /* Research for new Images */
    const handleGetNewImages = async () => {
      try {
        store.commit("images/FETCH_IMAGES_LOADING", true);
        await new Promise((resolve) => setTimeout(resolve, 3000));
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
  height: 10.625rem;
  object-fit: cover;
}
</style>
<style lang="scss" scoped>
@import "../styles/variables";

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
