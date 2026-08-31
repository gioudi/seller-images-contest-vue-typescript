import { ComputedRef, computed } from "vue";

interface ErrorStore {
  getError: string | null;
}

export function useError(store: ErrorStore): ComputedRef<string | null> {
  return computed(() => store.getError);
}
