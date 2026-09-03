<template>
  <section class="alegra-loading">
    <p class="h4 mt-3 alegra-color-dark">
      {{ $t("loading.message") }}
    </p>
    <article class="alegra-loading__item background-animation">
      <article class="container-circles">
        <div class="circle"></div>
        <div class="circle"></div>
      </article>
      <article class="container-circles">
        <div class="circle"></div>
        <div class="circle"></div>
      </article>
    </article>
  </section>
</template>
<script setup lang="ts"></script>
