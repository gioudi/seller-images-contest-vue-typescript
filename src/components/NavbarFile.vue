<template>
  <nav class="alegra-navbar">
    <div class="alegra-navbar-title">{{ $t("nav.appName") }}</div>
    <div class="alegra-navbar-buttons">
      <LanguageSwitcher />
      <ThemeToggle />
      <button v-if="!isLanding" class="alegra-navbar-button" @click="goHome">
        {{ $t("nav.home") }}
      </button>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import LanguageSwitcher from "./LanguageSwitcher.vue";
import ThemeToggle from "./ThemeToggle.vue";

const route = useRoute();
const router = useRouter();

const isLanding = computed(() => route.name === "LandingPage");
const goHome = () => router.push("/");
</script>
