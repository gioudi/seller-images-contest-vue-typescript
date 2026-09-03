import { computed } from "vue";
import { useImagesStore } from "@/stores/imagesStore";
import { useLoading } from "./useLoading";
import { useError } from "./useError";

export function useImages() {
  const store = useImagesStore();

  const images = computed(() => store.getImages);
  const loading = useLoading(store);
  const error = useError(store);
  const hasSearched = computed(() => store.getHasSearched);

  const fetchImages = (term: string) => store.fetchImagesList(term);

  return { images, loading, error, hasSearched, fetchImages };
}
