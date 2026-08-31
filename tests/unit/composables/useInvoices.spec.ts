import { beforeEach, describe, expect, it, vi } from "vitest";
import { createPinia, setActivePinia } from "pinia";
import apiService from "@/services/apiService";

vi.mock("@/services/apiService", () => ({
  default: { getSellers: vi.fn(), createInvoice: vi.fn() },
}));
vi.mock("@/utils/toastService", () => ({
  default: { showError: vi.fn(), showWarn: vi.fn() },
}));

import { useInvoices } from "@/composables/useInvoices";
import { useInvoicesStore } from "@/stores/invoicesStore";
import { InvoicePayload } from "@/stores/invoices/types";

const samplePayload: InvoicePayload = {
  date: "2026-08-31",
  dueDate: "2026-09-07",
  client: 1,
  winnerId: 1,
  productId: 1,
  total: 100,
};

describe("useInvoices", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.mocked(apiService.createInvoice).mockReset();
  });

  it("starts idle with no error", () => {
    const { loading, error } = useInvoices();
    expect(loading.value).toBe(false);
    expect(error.value).toBeNull();
  });

  it("submit creates the invoice and reports success", async () => {
    vi.mocked(apiService.createInvoice).mockResolvedValue({ id: 1 } as never);

    const { submit } = useInvoices();
    await submit(samplePayload);

    expect(apiService.createInvoice).toHaveBeenCalledWith(samplePayload);
    expect(useInvoicesStore().invoiceStatus).toBe(true);
  });
});
