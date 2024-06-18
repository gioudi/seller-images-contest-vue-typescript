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

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "WinnerModal",
  props: {
    show: {
      type: Boolean,
      required: true,
    },
    winnerName: {
      type: String,
      required: true,
    },
  },
  emits: ["proceed"],
  methods: {
    proceed() {
      this.$emit("proceed");
    },
  },
});
</script>
