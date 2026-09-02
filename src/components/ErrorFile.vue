<template>
  <article class="grid">
    <article class="grid-col-sm-12">
      <div class="error">
        <p class="h4 alegra-color-dark mt-3 mb-4">Error!</p>
        <p>{{ message }}</p>
      </div>
    </article>
  </article>
</template>

<script setup lang="ts">
defineProps<{
  message: string;
}>();
</script>
<style lang="scss">
.error-container {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
</style>
