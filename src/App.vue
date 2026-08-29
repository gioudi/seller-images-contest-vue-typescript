<template>
  <NavbarFile />
  <section class="container my-4 py-5 alegra-panel app">
    <router-view></router-view>
  </section>
  <FooterFile />
</template>

<script lang="ts">
import { defineComponent, onMounted } from "vue";
import { useSellersStore } from "@/stores/sellersStore";
import { useImagesStore } from "@/stores/imagesStore";
import getErrorMessage from "@/utils/getErrorMessage";
import NavbarFile from "./components/NavbarFile.vue";
import FooterFile from "./components/FooterFile.vue";

export default defineComponent({
  name: "App",
  components: {
    NavbarFile,
    FooterFile,
  },
  setup() {
    const sellersStore = useSellersStore();
    const imagesStore = useImagesStore();

    const handleGetSellers = async () => {
      try {
        sellersStore.setLoading(true);
        await imagesStore.fetchImagesList("cute");
        await sellersStore.handleFetchSellers();
      } catch (error) {
        sellersStore.setFailure(
          getErrorMessage(error, "Error fetching sellers")
        );
      } finally {
        sellersStore.setLoading(false);
      }
    };

    onMounted(() => {
      handleGetSellers();
    });
  },
});
</script>
<style lang="scss" scoped>
@media (min-width: 62rem) {
  .app {
    height: calc(100vh - 220px);
  }
}
</style>
