<template>
  <form class="searchbar" @submit.prevent="submit">
    <label for="searchTerm" class="d-flex mb-3">
      {{ $t("results.label") }}
    </label>
    <div class="searchbar__row">
      <input
        id="searchTerm"
        v-model="term"
        type="text"
        class="form-control"
        :placeholder="$t('common.searchPlaceholder')"
        required
      />
      <button type="submit" class="btn btn-primary">
        {{ $t("common.search") }}
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";

const props = defineProps<{
  initialTerm?: string;
}>();

const emit = defineEmits<{
  (e: "search", term: string): void;
}>();

const term = ref(props.initialTerm ?? "");

watch(
  () => props.initialTerm,
  (value) => {
    if (value !== undefined && value !== term.value) {
      term.value = value;
    }
  }
);

const submit = () => emit("search", term.value);
</script>

<style lang="scss" scoped>
.searchbar {
  margin-bottom: 1.5rem;

  &__row {
    display: flex;
    gap: 0.5rem;
    align-items: stretch;

    input {
      flex: 1;
    }

    button {
      flex: 0 0 auto;
    }
  }
}
</style>
