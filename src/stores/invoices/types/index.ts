export interface InvoicesState {
  loading: boolean;
  error: string | null;
  invoiceStatus: boolean;
}

export interface InvoicePayload {
  date: string;
  dueDate: string;
  client: number;
  winnerId: number;
  productId: number;
  total: number;
}
