<template>
  <article class="grid">
    <article class="grid-col-sm-12">
      <h1 class="alegra-sm-h4 alegra-lg-h1">Alegra Test</h1>
      <div class="alegra-card">
        <form @submit.prevent="handleSubmitFormData">
          <div>
            <label for="date">Date:</label>
            <input type="date" v-model="formData.date" required />
          </div>
          <div>
            <label for="dueDate">Due Date:</label>
            <input type="date" v-model="formData.dueDate" required />
          </div>
          <div>
            <label for="clientId">Client ID:</label>
            <input type="number" v-model="formData.client" required />
          </div>
          <div>
            <label for="productId">Product ID:</label>
            <input type="number" v-model="formData.productId" required />
          </div>
          <div>
            <label for="total">Total:</label>
            <input type="number" v-model="formData.total" required />
          </div>
          <button type="submit">Crear factura</button>
        </form>
      </div>
    </article>
  </article>
</template>
<script lang="ts">
import { InvoicePayload } from "@/store/modules/invoices/types";
import { defineComponent, reactive, ref } from "vue";
import { useRoute } from "vue-router";
import { useStore } from "vuex";

export default defineComponent({
  name: "InvoiceForm",
  setup() {
    const route = useRoute();
    const store = useStore();

    const formData: InvoicePayload = reactive({
      date: "",
      dueDate: "",
      client: 1,
      winnerId: Number(route.query.q) || 1,
      productId: 1,
      total: 0,
    });

    const handleSubmitFormData = async () => {
      try {
        store.commit("invoices/FETCH_INVOICE_LOADING", true);
        await store.dispatch(`invoices/handleCreateInvoice`, formData);
      } catch (error) {
        store.commit("invoices/FETCH_INVOICE_FAILURE", error);
      } finally {
        store.commit("invoices/FETCH_INVOICE_LOADING", false);
      }
    };

    return {
      handleSubmitFormData,
      formData,
    };
  },
});
</script>
<style scoped>
form {
  display: flex;
  flex-direction: column;
}
</style>
