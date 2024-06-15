<template>
  <article class="grid">
    <article class="grid-col-sm-12">
      <div class="error">
        <img src="" alt="Error" />
        <p>Loading ...</p>
      </div>
    </article>
  </article>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";

export default defineComponent({
  name: "LoadingFile",
});
</script>
