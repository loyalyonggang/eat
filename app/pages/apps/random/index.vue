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
    <CustomHeader title="Una 今天吃什么" :show-back-button="true" back-href="/apps" />
    <ion-content class="bg-gray-50 dark:bg-black">
      <div class="min-h-full flex flex-col items-center pt-10 sm:justify-center sm:pt-0">
        <RandomRecipe />
      </div>
    </ion-content>
  </ion-page>
</template>
