<script lang="ts" setup>
definePageMeta({
  alias: ['/', '/home', '/tabs'],
})

useHead({
  title: 'Una 的食用手册',
})

const ionContentRef = ref<HTMLElement>()

const rStore = useRecipeStore()
</script>

<template>
  <ion-page>
    <CustomHeader title="Una 今天吃点什么？">
      <template #end-buttons>
        <ion-button
          fill="clear"
          class="reset-button"
          title="重置"
          @click="rStore.reset"
        >
          <div v-if="rStore.selectedStuff.length" class="text-green-600" i-mdi-pot-steam-outline />
          <div v-else class="text-gray-500" i-mdi-pot-mix-outline />
        </ion-button>
      </template>
    </CustomHeader>
    <ion-content ref="ionContentRef" class="bg-gray-50 dark:bg-black">
      <ChooseFood />
    </ion-content>
  </ion-page>
</template>

<style scoped>
.reset-button {
  --color: #6b7280;
  --color-hover: #ec4899;
  margin-right: 8px;
}

.reset-button:hover {
  --color: #ec4899;
}

@media (prefers-color-scheme: dark) {
  .reset-button {
    --color: #9ca3af;
  }

  .reset-button:hover {
    --color: #ec4899;
  }
}
</style>
