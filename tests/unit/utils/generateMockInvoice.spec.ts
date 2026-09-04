import { describe, expect, it } from "vitest";
import generateMockInvoice from "@/utils/generateMockInvoice";
import { InvoicePayload } from "@/stores/invoices/types";

const payload: InvoicePayload = {
  date: "2026-09-04",
  dueDate: "2026-09-11",
  client: 1,
  winnerId: 1,
  productId: 1,
  total: 100,
};

describe("generateMockInvoice", () => {
  it("builds an invoice number derived from the payload year and a fixed timestamp", () => {
    const result = generateMockInvoice(payload, 1700000012345);

    expect(result.id).toBe(1700000012345);
    expect(result.number).toBe("INV-2026-12345");
  });

  it("falls back to the current year when the payload has no date", () => {
    const noDatePayload: InvoicePayload = { ...payload, date: "" };
    const result = generateMockInvoice(noDatePayload, 1700000000000);

    expect(result.number).toMatch(/^INV-\d{4}-00000$/);
  });

  it("always returns a positive integer id and a matching number suffix", () => {
    const result = generateMockInvoice(payload, 42);

    expect(result.id).toBe(42);
    expect(result.number.endsWith("00042")).toBe(true);
  });
});
