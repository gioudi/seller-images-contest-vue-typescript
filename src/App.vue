<template>
  <NavbarFile />
  <section class="container my-4 py-5 alegra-panel app">
    <router-view></router-view>
  </section>
  <FooterFile />
</template>

<script lang="ts">
import { defineComponent, onMounted } from "vue";
import { useSellers } from "@/composables/useSellers";
import { useImages } from "@/composables/useImages";
import NavbarFile from "./components/NavbarFile.vue";
import FooterFile from "./components/FooterFile.vue";

export default defineComponent({
  name: "App",
  components: {
    NavbarFile,
    FooterFile,
  },
  setup() {
    const { fetchSellers } = useSellers();
    const { fetchImages } = useImages();

    onMounted(async () => {
      await fetchImages("cute");
      await fetchSellers();
    });
  },
});
</script>
<style lang="scss" scoped></style>
