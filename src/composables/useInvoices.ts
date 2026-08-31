import { useInvoicesStore } from "@/stores/invoicesStore";
import { InvoicePayload } from "@/stores/invoices/types";
import getErrorMessage from "@/utils/getErrorMessage";
import { useLoading } from "./useLoading";
import { useError } from "./useError";

export function useInvoices() {
  const store = useInvoicesStore();

  const loading = useLoading(store);
  const error = useError(store);

  const submit = async (payload: InvoicePayload) => {
    store.setLoading(true);
    try {
      await store.handleCreateInvoice(payload);
    } catch (err) {
      store.setFailure(getErrorMessage(err, "Error creating an Invoice"));
    } finally {
      store.setLoading(false);
    }
  };

  return { loading, error, submit };
}
