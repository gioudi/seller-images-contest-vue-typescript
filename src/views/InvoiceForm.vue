<template>
  <article class="grid">
    <article class="grid-col-sm-12">
      <h1 class="alegra-sm-h4 alegra-lg-h1">Alegra Test</h1>
    </article>
  </article>
</template>
<script lang="ts">
import { defineComponent, ref } from "vue";
import { useRoute } from "vue-router";

export default defineComponent({
  name: "InvoiceForm",
  setup() {
    const searchTerm = ref("");
    const route = useRoute();
  },
});
</script>
