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
    <ion-header class="ion-no-border">
      <ion-toolbar class="bg-transparent">
        <ion-title>
          <button
            class="m-auto flex cursor-pointer items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium transition hover:bg-gray-100 active:scale-95 dark:hover:bg-gray-800"
            title="重置"
            @click="rStore.reset"
          >
            <div v-if="rStore.selectedStuff.length" class="text-green-600" i-mdi-pot-steam-outline />
            <div v-else class="text-gray-500" i-mdi-pot-mix-outline />

            <span>
              Una 今天吃点什么？
            </span>
          </button>
        </ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content ref="ionContentRef" class="bg-gray-50 dark:bg-black">
      <ChooseFood />
    </ion-content>
  </ion-page>
</template>
