import { beforeEach, describe, expect, it, vi } from "vitest";

const axiosMocks = vi.hoisted(() => ({
  get: vi.fn(),
  post: vi.fn(),
}));

vi.mock("@/services/axiosClient", () => ({
  default: axiosMocks,
}));

import apiService from "@/services/apiService";
import { InvoicePayload } from "@/stores/invoices/types";

const payload: InvoicePayload = {
  date: "2026-09-04",
  dueDate: "2026-09-11",
  client: 1,
  winnerId: 1,
  productId: 1,
  total: 100,
};

describe("apiService.createInvoice", () => {
  beforeEach(() => {
    axiosMocks.get.mockReset();
    axiosMocks.post.mockReset();
  });

  it("does not call axiosClient when mocking is enabled (default)", async () => {
    const result = await apiService.createInvoice(payload);

    expect(axiosMocks.post).not.toHaveBeenCalled();
    expect(result.id).toBeTypeOf("number");
    expect(result.number).toMatch(/^INV-\d{4}-\d{5}$/);
  });

  it("still calls the real endpoint for getSellers", async () => {
    axiosMocks.get.mockResolvedValue({ data: [] });

    await apiService.getSellers();

    expect(axiosMocks.get).toHaveBeenCalledWith("/sellers");
  });
});
