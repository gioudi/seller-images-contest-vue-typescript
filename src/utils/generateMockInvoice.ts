import { ALEGRA } from "@/config";
import { InvoicePayload, InvoiceResponse } from "@/stores/invoices/types";

/**
 * Builds a fake, realistic-looking InvoiceResponse without calling Alegra.
 * Pure function: same inputs -> same shape (id is timestamp-derived, so it
 * is only "stable" in the sense of always being a positive integer with a
 * matching human-readable `number`).
 */
export default function generateMockInvoice(
  payload: InvoicePayload,
  now: number = Date.now()
): InvoiceResponse {
  const year = payload.date
    ? new Date(payload.date).getFullYear()
    : new Date(now).getFullYear();
  const sequence = String(now).padStart(5, "0").slice(-5);

  return {
    id: now,
    number: `${ALEGRA.MOCK_INVOICE_PREFIX}-${String(year)}-${sequence}`,
  };
}
