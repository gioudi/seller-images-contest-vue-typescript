import { SellersState } from "../modules/sellers/types";
import { ImagesState } from "../modules/images/types";
import { InvoicesState } from "../modules/invoices/types";

export interface RootState {
  sellers: SellersState;
  images: ImagesState;
  invoices: InvoicesState;
}
