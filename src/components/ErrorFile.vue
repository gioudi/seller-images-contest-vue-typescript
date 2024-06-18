<template>
  <article class="grid">
    <article class="grid-col-sm-12">
      <h4 class="h4 alegra-color-dark">Error!</h4>
      <div class="error">
        <img src="" alt="Error" />
        <p>{{ message }}</p>
      </div>
    </article>
  </article>
</template>
s

<script lang="ts">
import { defineComponent, PropType } from "vue";

export default defineComponent({
  name: "ErrorFile",
  props: {
    message: {
      type: String as PropType<string>,
      required: true,
    },
  },
});
</script>
