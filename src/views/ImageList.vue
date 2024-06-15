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
      <div class="grid">
        <div
          v-for="image in images"
          :key="image"
          class="grid-col-xs-12 grid-col-sm-12 grid-col-md-4 grid-col-lg-4"
        >
          <img
            class="alegra-card image-container"
            :src="image.urls.full"
            :alt="image.alt_description"
            srcset=""
          />
        </div>
      </div>
      <div class="grid">
        <div class="grid-col-xs-12 grid-col-sm-12">
          <ul v-for="seller in sellers" :key="seller">
            <li>{{ seller }}</li>
          </ul>
        </div>
      </div>
    </article>
  </article>
</template>
<script lang="ts">
import { computed, defineComponent, onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { useStore } from "vuex";

export default defineComponent({
  name: "ImageList",
  setup() {
    const store = useStore();
    const route = useRoute();
    const searchTerm = ref("");
    const loading = computed(() => store.getters["images/loading"]);
    const error = computed(() => store.getters["images/getError"]);
    const images = computed(() => store.getters["images/getImages"]);
    const sellers = computed(() => store.getters["sellers/getSellers"]);

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

    onMounted(() => {
      handleGetImages();
    });

    return {
      loading,
      error,
      sellers,
      images,
      searchTerm,
    };
  },
});
</script>

<style lang="scss" scoped>
.image-container {
  width: 100%;
  max-width: 13.125rem;
  display: flex;
  height: 15.625rem;
  object-fit: cover;
}
</style>
