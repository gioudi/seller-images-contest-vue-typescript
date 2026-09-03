<template>
  <form class="searchbar" @submit.prevent="submit">
    <label for="searchTerm" class="d-flex mb-3">
      {{ $t("results.label") }}
    </label>
    <div class="searchbar__row">
      <div class="searchbar__input-group">
        <input
          id="searchTerm"
          v-model="term"
          type="text"
          class="form-control"
          :placeholder="$t('common.searchPlaceholder')"
          required
        />
        <button
          v-if="term"
          type="button"
          class="searchbar__clear"
          :aria-label="$t('common.clearSearch')"
          @click="clearSearch"
        >
          &times;
        </button>
      </div>
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
  (e: "clear"): void;
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

const clearSearch = () => {
  term.value = "";
  emit("clear");
};
</script>

<style lang="scss" scoped>
@import "../../styles/abstracts/variables";

.searchbar {
  margin-bottom: 1.5rem;

  &__row {
    display: flex;
    gap: 0.5rem;
    align-items: stretch;

    button {
      flex: 0 0 auto;
    }
  }

  &__input-group {
    position: relative;
    flex: 1;
    display: flex;
    align-items: stretch;

    input {
      width: 100%;
      padding-right: 2.5rem;
    }
  }

  &__clear {
    position: absolute;
    right: 0.5rem;
    top: 50%;
    transform: translateY(-50%);
    width: 1.5rem;
    height: 1.5rem;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    line-height: 1;
    font-size: 1.25rem;
    border: none;
    background: transparent;
    cursor: pointer;
    color: $color-medium;

    &:hover {
      color: $color-dark;
    }
  }
}
</style>
