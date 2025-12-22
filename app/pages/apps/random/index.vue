<script setup lang="ts">
definePageMeta({
  alias: ['/random'],
})

useHead({
  title: '今天吃什么',
})
</script>

<template>
  <ion-page>
    <ion-header class="ion-no-border">
      <ion-toolbar class="bg-transparent">
        <ion-buttons slot="start">
          <ion-back-button default-href="/apps" text="" />
        </ion-buttons>

        <ion-title>
          Una 今天吃什么
        </ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="bg-gray-50 dark:bg-black">
      <div class="flex min-h-full flex-col items-center pt-10 sm:justify-center sm:pt-0">
        <RandomRecipe />
      </div>
    </ion-content>
  </ion-page>
</template>
