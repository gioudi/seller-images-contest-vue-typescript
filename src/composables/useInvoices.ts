import { useInvoicesStore } from "@/stores/invoicesStore";
import { InvoicePayload, InvoiceResponse } from "@/stores/invoices/types";
import getErrorMessage from "@/utils/getErrorMessage";
import { useLoading } from "./useLoading";
import { useError } from "./useError";

export function useInvoices() {
  const store = useInvoicesStore();

  const loading = useLoading(store);
  const error = useError(store);

  const submit = async (
    payload: InvoicePayload
  ): Promise<InvoiceResponse | null> => {
    store.setLoading(true);
    try {
      return await store.handleCreateInvoice(payload);
    } catch (err) {
      store.setFailure(getErrorMessage(err, "Error creating an Invoice"));
      return null;
    } finally {
      store.setLoading(false);
    }
  };

  return { loading, error, submit };
}
