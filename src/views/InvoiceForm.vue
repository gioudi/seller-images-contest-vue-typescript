<template>
  <article class="grid invoice-form">
    <article class="grid-col-xs-12 grid-col-md-6 form-wrapper">
      <h1 class="h3 mb-4 mt-3">Crear factura de venta!</h1>
      <form class="form-container" @submit.prevent="handleSubmitFormData">
        <div class="mb-3 form-field">
          <label for="date" class="normal mb-1">Fecha:</label>
          <input v-model="formData.date" type="date" required />
        </div>
        <div class="mb-3 form-field">
          <label for="dueDate" class="normal mb-1">Fecha de venta:</label>
          <input v-model="formData.dueDate" type="date" required />
        </div>
        <div class="mb-3 form-field">
          <label for="clientId" class="normal mb-1">Id Cliente:</label>
          <input v-model="formData.client" type="number" required />
        </div>
        <div class="mb-3 form-field">
          <label for="productId" class="normal mb-1">Id Producto:</label>
          <input v-model="formData.productId" type="number" required />
        </div>
        <div class="mb-3 form-field">
          <label for="total" class="normal mb-1">Total:</label>
          <input v-model="formData.total" type="number" required />
        </div>
        <button type="submit" class="btn btn-primary my-3">
          Crear factura
        </button>
      </form>
    </article>
  </article>
</template>

<script lang="ts">
import { InvoicePayload } from "@/stores/invoices/types";
import toastService from "@/utils/toastService";
import { defineComponent, reactive } from "vue";
import { useRoute } from "vue-router";
import { useInvoices } from "@/composables/useInvoices";

export default defineComponent({
  name: "InvoiceForm",
  setup() {
    const route = useRoute();
    const { submit } = useInvoices();

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
        await submit(formData);
      } else {
        toastService.showWarn("Todos los campos son necesarios!");
      }
    };

    return {
      handleSubmitFormData,
      formData,
    };
  },
});
</script>

<style lang="scss" scoped>
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
