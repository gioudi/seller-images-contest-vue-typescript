<template>
  <section class="alegra-loading">
    <h4 class="h4 mt-3 alegra-color-dark">
      Procesando su solicitud, por favor espere...
    </h4>
    <article class="alegra-loading__item background-animation">
      <article class="container-circles">
        <div class="circle"></div>
        <div class="circle"></div>
      </article>
      <article class="container-circles">
        <div class="circle"></div>
        <div class="circle"></div>
      </article>
    </article>
  </section>
</template>
<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  name: "LoadingFile",
});
</script>
