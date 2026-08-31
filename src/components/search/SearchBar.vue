<template>
  <form @submit.prevent="submit">
    <label for="searchTerm" class="d-flex mb-3"
      >¿Quieres buscar algo nuevo?
    </label>
    <input
      type="text"
      id="searchTerm"
      class="d-flex form-control"
      v-model="term"
      placeholder="Buscar imágenes"
      required
    />
    <button type="submit" class="btn btn-primary my-3">Buscar</button>
  </form>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";

export default defineComponent({
  name: "SearchBar",
  emits: ["search"],
  props: {
    initialTerm: {
      type: String,
      default: "",
    },
  },
  setup(props, { emit }) {
    const term = ref(props.initialTerm ?? "");

    const submit = () => emit("search", term.value);

    return { term, submit };
  },
});
</script>
