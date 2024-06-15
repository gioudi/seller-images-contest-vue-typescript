<template>
  <article class="grid">
    <article class="grid-col-sm-12">
      <h1 class="alegra-sm-h4 alegra-lg-h1">Alegra Test</h1>
      <div class="grid my-3">
        <div class="grid-col-sm-12">
          <input
            type="text"
            v-model="searchTerm"
            placeholder="Perros, Gatos ..."
          />
        </div>
        <div class="grid-col-sm-12">
          <button @click="searchImages">Buscar</button>
        </div>
      </div>
    </article>
  </article>
</template>
<script lang="ts">
import { defineComponent, ref } from "vue";
import { useRouter } from "vue-router";

export default defineComponent({
  name: "LandingPage",
  setup() {
    const searchTerm = ref("");
    const router = useRouter();

    const searchImages = () => {
      if (searchTerm.value.trim()) {
        router.push({
          name: "ImageList",
          query: { q: searchTerm.value.trim() },
        });
      }
    };

    return {
      searchTerm,
      searchImages,
    };
  },
});
</script>
