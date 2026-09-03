<template>
  <div class="grid">
    <div
      v-for="seller in sellers"
      :key="seller.id"
      class="grid-col-xs-12 grid-col-sm-6 grid-col-md-4 grid-col-lg-3"
    >
      <SellerCard :seller="seller" @vote="emitVote" />
    </div>
  </div>
</template>

<script setup lang="ts">
import SellerCard from "./SellerCard.vue";

interface SellerGridData {
  id: number;
  name: string;
  points: number;
  clickable: boolean;
  image: string;
  alt_description: string;
}

defineProps<{
  sellers: SellerGridData[];
}>();

const emit = defineEmits<{
  (e: "vote", seller: SellerGridData): void;
}>();

const emitVote = (seller: SellerGridData) => emit("vote", seller);
</script>
