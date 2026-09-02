<!-- WinnerModal.vue -->
<template>
  <div v-if="show" class="alegra-modal">
    <div class="alegra-modal-content">
      <h2>Felicitationes!</h2>
      <p>El ganador es {{ winnerName }}!</p>
      <button @click="proceed">Continuar</button>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  show: boolean;
  winnerName: string;
}>();

const emit = defineEmits<{
  (e: "proceed"): void;
}>();

const proceed = () => emit("proceed");
</script>
