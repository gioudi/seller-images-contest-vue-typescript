<template>
  <NavbarFile />
  <section class="container my-4 py-5 alegra-panel app">
    <router-view></router-view>
  </section>
  <FooterFile />
</template>

<script lang="ts">
import { defineComponent, onMounted } from "vue";
import { useStore } from "vuex";
import NavbarFile from "./components/NavbarFile.vue";
import FooterFile from "./components/FooterFile.vue";

export default defineComponent({
  name: "App",
  components: {
    NavbarFile,
    FooterFile,
  },
  setup() {
    const store = useStore();

    const handleGetSellers = async () => {
      try {
        store.commit("sellers/FETCH_SELLERS_LOADING", true);
        await new Promise((resolve) => setTimeout(resolve, 5000));
        await store.dispatch("images/handleFetchImagesList", "cute");
        await store.dispatch("sellers/handleFetchSellers");
      } catch (error) {
        store.commit("sellers/FETCH_SELLERS_FAILURE", error);
      } finally {
        store.commit("sellers/FETCH_SELLERS_LOADING", false);
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
