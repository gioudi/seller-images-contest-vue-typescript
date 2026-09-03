<template>
  <select
    class="alegra-navbar-select"
    :value="currentLocale"
    aria-label="language"
    @change="onChange"
  >
    <option v-for="option in locales" :key="option.value" :value="option.value">
      {{ option.label }}
    </option>
  </select>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { switchLocale, type SupportedLocale } from "@/i18n";

const { locale } = useI18n();

const locales: { value: SupportedLocale; label: string }[] = [
  { value: "es", label: "Español" },
  { value: "en", label: "English" },
  { value: "de", label: "Deutsch" },
];

const currentLocale = computed(() => locale.value as SupportedLocale);

const onChange = (event: Event) => {
  const value = (event.target as HTMLSelectElement).value as SupportedLocale;
  switchLocale(value);
};
</script>

<style lang="scss" scoped>
@import "../styles/abstracts/variables";

.alegra-navbar-select {
  background-color: transparent;
  color: $color-white;
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: $border-radius-xs;
  padding: 0.4rem 0.5rem;
  cursor: pointer;

  option {
    color: $color-dark;
  }
}
</style>
