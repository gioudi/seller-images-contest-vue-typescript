<template>
  <nav class="alegra-navbar">
    <div class="alegra-navbar-title">Imágenes del mundo</div>
    <div class="alegra-navbar-buttons">
      <button class="alegra-navbar-button" @click="goHome">Volver</button>
    </div>
  </nav>
</template>
<script setup lang="ts">
import { useRouter } from "vue-router";

const router = useRouter();
const goHome = () => router.push("/");
</script>
