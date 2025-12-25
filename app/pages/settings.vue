<script lang="ts" setup>
const { isDark, toggleDark } = useDarkMode()

const app = useAppStore()

definePageMeta({
  layout: 'child',
})
</script>

<template>
  <ion-page>
    <CustomHeader title="设置" :show-back-button="true" back-href="/my" />

    <ion-content>
      <ion-list-header>外观</ion-list-header>
      <ion-list :inset="true">
        <ion-item>
          <ion-toggle :checked="isDark" justify="space-between" @ion-change="toggleDark">
            暗色模式
          </ion-toggle>
        </ion-item>
      </ion-list>

      <ion-list-header>数据</ion-list-header>
      <ion-list :inset="true">
        <ion-item>
          <ion-toggle v-model:checked="app.settings.keepLocalData" justify="space-between">
            离开网页后保留选中数据
          </ion-toggle>
        </ion-item>
      </ion-list>
    </ion-content>
  </ion-page>
</template>

<style>
/* (Optional) This is added to prevent the flashing that happens when toggling between palettes */
ion-item {
  --transition: none;
}
</style>
