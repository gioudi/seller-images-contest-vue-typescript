<template>
  <article class="grid invoice-form">
    <article class="grid-col-xs-12 grid-col-md-6 form-wrapper">
      <h1 class="h3 mb-4 mt-3">{{ $t("invoice.title") }}</h1>
      <form class="form-container" @submit.prevent="handleSubmitFormData">
        <div class="mb-3 form-field">
          <label for="date" class="normal mb-1">{{ $t("invoice.date") }}</label>
          <input v-model="formData.date" type="date" required />
        </div>
        <div class="mb-3 form-field">
          <label for="dueDate" class="normal mb-1">
            {{ $t("invoice.dueDate") }}
          </label>
          <input v-model="formData.dueDate" type="date" required />
        </div>
        <div class="mb-3 form-field">
          <label for="clientId" class="normal mb-1">
            {{ $t("invoice.clientId") }}
          </label>
          <input v-model="formData.client" type="number" required />
        </div>
        <div class="mb-3 form-field">
          <label for="productId" class="normal mb-1">
            {{ $t("invoice.productId") }}
          </label>
          <input v-model="formData.productId" type="number" required />
        </div>
        <div class="mb-3 form-field">
          <label for="total" class="normal mb-1">
            {{ $t("invoice.total") }}
          </label>
          <input v-model="formData.total" type="number" required />
        </div>
        <button type="submit" class="btn btn-primary my-3">
          {{ $t("invoice.submit") }}
        </button>
      </form>
    </article>
    <InvoiceSuccessModal
      :show="showSuccessModal"
      :invoice-number="invoiceResult?.number ?? ''"
      :date="formData.date"
      :total="formData.total"
      @proceed="handleSuccessContinue"
    />
  </article>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { InvoicePayload, InvoiceResponse } from "@/stores/invoices/types";
import toastService from "@/utils/toastService";
import { useInvoices } from "@/composables/useInvoices";
import InvoiceSuccessModal from "@/components/InvoiceSuccessModal.vue";

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const { submit } = useInvoices();

const showSuccessModal = ref(false);
const invoiceResult = ref<InvoiceResponse | null>(null);

const formData: InvoicePayload = reactive({
  date: "",
  dueDate: "",
  client: 1,
  winnerId: Number(route.query.q) || 1,
  productId: 1,
  total: 0,
});

const validateFormData = () => {
  for (const key in formData) {
    if (
      formData[key as keyof InvoicePayload] === null ||
      formData[key as keyof InvoicePayload] === ""
    ) {
      return false;
    }
  }
  return true;
};

const handleSubmitFormData = async () => {
  if (validateFormData()) {
    const result = await submit(formData);
    if (result) {
      invoiceResult.value = result;
      showSuccessModal.value = true;
    }
  } else {
    toastService.showWarn(t("invoice.allFieldsRequired"));
  }
};

const handleSuccessContinue = () => {
  showSuccessModal.value = false;
  router.push({ name: "LandingPage" });
};
</script>

<style lang="scss" scoped>
@import "../styles/abstracts/variables";

.invoice-form {
  display: flex;
  justify-content: center;
  text-align: center;
}

.form-wrapper {
  width: 100%;
  max-width: 600px;
}

.form-container {
  display: block;
  box-sizing: border-box;
}

.form-field {
  box-sizing: border-box;
  text-align: left;

  label {
    display: inline-block;
    text-align: left;
  }
  input {
    width: 100%;
    display: inline-block;
    box-sizing: border-box;
  }
}

button {
  width: 100%;
  padding: 0.5rem;
  box-sizing: border-box;
}
</style>
