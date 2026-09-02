<template>
  <form @submit.prevent="submit">
    <label for="searchTerm" class="d-flex mb-3"
      >¿Quieres buscar algo nuevo?
    </label>
    <input
      id="searchTerm"
      v-model="term"
      type="text"
      class="d-flex form-control"
      placeholder="Buscar imágenes"
      required
    />
    <button type="submit" class="btn btn-primary my-3">Buscar</button>
  </form>
</template>

<script setup lang="ts">
import { ref } from "vue";

const props = defineProps<{
  initialTerm?: string;
}>();

const emit = defineEmits<{
  (e: "search", term: string): void;
}>();

const term = ref(props.initialTerm ?? "");

const submit = () => emit("search", term.value);
</script>
