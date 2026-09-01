import { computed } from "vue";
import { useSellersStore } from "@/stores/sellersStore";
import { Seller } from "@/stores/sellers/types";
import { CONTEST } from "@/config";
import { useLoading } from "./useLoading";
import { useError } from "./useError";

export function useSellers() {
  const store = useSellersStore();

  const sellers = computed(() => store.getSellers);
  const loading = useLoading(store);
  const error = useError(store);
  const contestEnded = computed(() => store.getContestEnded);
  const winner = computed(() => store.getWinner);

  const fetchSellers = () => store.handleFetchSellers();

  const vote = (seller: Seller) => {
    if (!store.getContestEnded) {
      store.updateSellerPoints(seller.id, CONTEST.VOTE_POINTS);
    }
  };

  const resetClickable = () => {
    store.setClickableSeller();
  };

  return {
    sellers,
    loading,
    error,
    contestEnded,
    winner,
    fetchSellers,
    vote,
    resetClickable,
  };
}
