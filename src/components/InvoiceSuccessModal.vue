<!-- InvoiceSuccessModal.vue -->
<template>
  <div
    v-if="show"
    class="alegra-modal"
    role="dialog"
    aria-modal="true"
    aria-labelledby="invoiceSuccessModalTitle"
  >
    <div class="alegra-modal-content">
      <h2 id="invoiceSuccessModalTitle">{{ $t("invoice.successTitle") }}</h2>
      <p>{{ $t("invoice.successMessage", { number: invoiceNumber }) }}</p>
      <p>
        <strong>{{ $t("invoice.successNumber") }}</strong> {{ invoiceNumber }}
      </p>
      <p>
        <strong>{{ $t("invoice.successDate") }}</strong> {{ date }}
      </p>
      <p>
        <strong>{{ $t("invoice.successTotal") }}</strong> {{ total }}
      </p>
      <button class="btn btn-primary mt-3" @click="proceed">
        {{ $t("invoice.successContinue") }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  show: boolean;
  invoiceNumber: string;
  date: string;
  total: number;
}>();

const emit = defineEmits<{
  (e: "proceed"): void;
}>();

const proceed = () => emit("proceed");
</script>
