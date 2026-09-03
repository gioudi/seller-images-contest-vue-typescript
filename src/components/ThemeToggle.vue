<template>
  <button
    class="alegra-navbar-button"
    type="button"
    :aria-label="theme === 'dark' ? $t('theme.toLight') : $t('theme.toDark')"
    @click="toggleTheme"
  >
    {{ theme === "dark" ? "\u2600\uFE0F" : "\u{1F319}" }}
  </button>
</template>

<script setup lang="ts">
import { useTheme } from "@/composables/useTheme";

const { theme, toggleTheme } = useTheme();
</script>
