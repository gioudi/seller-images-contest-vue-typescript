import { ComputedRef, computed } from "vue";

interface LoadingStore {
  getLoading: boolean;
}

export function useLoading(store: LoadingStore): ComputedRef<boolean> {
  return computed(() => store.getLoading);
}
