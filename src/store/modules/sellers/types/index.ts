export interface Seller {
  id: number;
  name: string;
  points: number;
}

export interface SellersState {
  sellers: Seller[];
}
