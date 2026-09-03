<!-- WinnerModal.vue -->
<template>
  <div
    v-if="show"
    class="alegra-modal"
    role="dialog"
    aria-modal="true"
    aria-labelledby="winnerModalTitle"
  >
    <div class="alegra-modal-content">
      <h2 id="winnerModalTitle">{{ $t("winner.title") }}</h2>
      <p>{{ $t("winner.message", { name: winnerName }) }}</p>
      <button class="btn btn-primary mt-3" @click="proceed">
        {{ $t("winner.continue") }}
      </button>
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
