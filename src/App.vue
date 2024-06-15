<template>
  <section class="container py-5">
    <router-view></router-view>
  </section>
</template>

<script lang="ts">
import { defineComponent, onMounted } from "vue";
import { useStore } from "vuex";

export default defineComponent({
  name: "App",
  setup() {
    const store = useStore();

    const handleGetSellers = async () => {
      try {
        store.commit("sellers/FETCH_SELLERS_LOADING", true);
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
