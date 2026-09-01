<template>
  <article class="grid">
    <article v-if="loading" class="grid-col-xs-11 grid-col-md-12">
      <!-- loading -->
      <LoadingFile></LoadingFile>
    </article>
    <article v-else-if="error" class="grid-col-xs-11 grid-col-md-12">
      <!-- Error -->
      <ErrorFile :message="error"></ErrorFile>
    </article>
    <article v-if="!loading && !error" class="grid-col-xs-11 grid-col-lg-6">
      <h1 class="h3 mt-3 mb-4">Descubre Imágenes que Inspiran</h1>
      <p class="mb-3">
        Busca y encuentra imágenes asombrosas para cualquier proyecto.
        Simplemente ingresa una palabra clave para comenzar.
      </p>
      <form @submit.prevent="searchImages">
        <label for="searchTerm" class="container-greet d-flex mb-3"
          >¿Qué estás buscando?
        </label>
        <input
          type="text"
          id="searchTerm"
          class="d-flex form-control"
          v-model="searchTerm"
          placeholder="Buscar imágenes"
          required
        />
        <button type="submit" class="btn btn-primary my-3">Buscar</button>
      </form>
    </article>
    <article
      class="grid-col-xs-11 grid-col-lg-5"
      v-if="images && !loading && !error"
    >
      <CarouselFile :images="images" />
    </article>
  </article>
</template>
<script lang="ts">
import toastService from "@/utils/toastService";
import { useRouter } from "vue-router";
import { defineComponent, ref } from "vue";
import CarouselFile from "../components/CarouselFile.vue";
import { useImages } from "@/composables/useImages";
import LoadingFile from "../components/LoadingFile.vue";
import ErrorFile from "../components/ErrorFile.vue";

export default defineComponent({
  name: "LandingPage",
  components: {
    CarouselFile,
    LoadingFile,
    ErrorFile,
  },
  setup() {
    const searchTerm = ref("");
    const router = useRouter();
    const { images, loading, error } = useImages();
    const searchImages = () => {
      if (searchTerm.value.trim()) {
        router.push({
          name: "ImageList",
          query: { q: searchTerm.value.trim() },
        });
      } else {
        toastService.showWarn("Ingrese una palabra en el input");
      }
    };

    return {
      searchTerm,
      searchImages,
      images,
      loading,
      error,
    };
  },
});
</script>
