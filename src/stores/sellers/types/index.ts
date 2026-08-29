export interface Seller {
  id: number;
  name: string;
  points: number;
  clickable: boolean;
}

export interface SellersState {
  sellers: Seller[];
  loading: boolean;
  error: string | null;
  contestEnded: boolean;
  winner: Seller | null;
}
