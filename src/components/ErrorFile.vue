<template>
  <article class="grid">
    <article class="grid-col-sm-12">
      <div class="error">
        <h4 class="h4 alegra-color-dark mt-3 mb-4">Error!</h4>
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
<style lang="scss">
.error-container {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
</style>
