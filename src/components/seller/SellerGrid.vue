<template>
  <div class="grid">
    <div
      v-for="seller in sellers"
      :key="seller.id"
      class="grid-col-xs-11 grid-col-sm-12 grid-col-md-4 grid-col-lg-4"
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
