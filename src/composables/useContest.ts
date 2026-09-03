import { computed } from "vue";
import { useRouter } from "vue-router";
import { Seller } from "@/stores/sellers/types";
import { IMAGES } from "@/config";
import { useImages } from "./useImages";
import { useSellers } from "./useSellers";

export interface SellerWithImage extends Seller {
  image: string;
  alt_description: string;
}

export function useContest() {
  const { images, loading, error, hasSearched, fetchImages } = useImages();
  const { sellers, contestEnded, winner, vote, resetClickable } = useSellers();
  const router = useRouter();

  const noResults = computed(
    () =>
      hasSearched.value &&
      !loading.value &&
      !error.value &&
      images.value.length === 0
  );

  const sellerWithImages = computed<SellerWithImage[]>(() => {
    const totalImages = images.value.length;
    return sellers.value.map((seller: Seller) => {
      const image =
        totalImages > 0 ? images.value[seller.id % totalImages] : undefined;
      return {
        ...seller,
        image: image ? image.urls.small : IMAGES.FALLBACK_URL,
        alt_description: image ? image.alt_description : "Imagen del concurso",
      };
    });
  });

  const fetchInitialImages = (term: string) => fetchImages(term);

  const searchNewImages = async (term: string) => {
    await fetchImages(term);
    resetClickable();
    void router.replace({
      name: "ImageList",
      query: { q: term },
    });
  };

  const clearSearch = async () => {
    await fetchImages("");
    resetClickable();
    void router.replace({ name: "ImageList" });
  };

  const handleContinue = () => {
    void router.push({
      name: "InvoiceForm",
      query: { q: winner.value?.id },
    });
  };

  return {
    loading,
    error,
    noResults,
    sellerWithImages,
    contestEnded,
    winner,
    vote,
    fetchInitialImages,
    searchNewImages,
    clearSearch,
    handleContinue,
  };
}
