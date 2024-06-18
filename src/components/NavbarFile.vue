<template>
  <nav class="alegra-navbar">
    <div class="alegra-navbar-title">Imágenes del mundo</div>
    <div class="alegra-navbar-buttons">
      <button @click="goHome" class="alegra-navbar-button">Volver</button>
    </div>
  </nav>
</template>
<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  name: "NavbarFile",
  methods: {
    goHome() {
      this.$router.push("/");
    },
  },
});
</script>
