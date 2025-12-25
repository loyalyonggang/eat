<script setup lang="ts">
interface Props {
  title: string
  showBackButton?: boolean
  backHref?: string
  transparent?: boolean
}

withDefaults(defineProps<Props>(), {
  showBackButton: false,
  backHref: '/apps',
  transparent: false,
})
</script>

<template>
  <ion-header class="ion-no-border custom-header">
    <ion-toolbar
      :class="{
        'bg-transparent': transparent,
        'custom-toolbar': !transparent,
      }"
    >
      <ion-buttons v-if="showBackButton" slot="start">
        <ion-back-button
          :default-href="backHref"
          :color="transparent ? 'light' : 'dark'"
          class="custom-back-button"
        />
      </ion-buttons>

      <ion-title
        :class="{
          'text-white font-bold': transparent,
          'custom-title': !transparent,
        }"
      >
        {{ title }}
      </ion-title>

      <ion-buttons slot="end">
        <slot name="end-buttons" />
      </ion-buttons>
    </ion-toolbar>
  </ion-header>
</template>

<style scoped>
.custom-header {
  --background: transparent;
}

.custom-toolbar {
  --background: rgba(255, 255, 255, 0.95);
  --color: #1f2937;
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  --min-height: 60px;
}

.custom-title {
  font-size: 20px;
  font-weight: 700;
  color: #1f2937;
  text-align: center;
}

.custom-back-button {
  --color: #6b7280;
  --icon-font-size: 24px;
  margin-left: 8px;
}

.custom-back-button:hover {
  --color: #ec4899;
}

/* 深色模式 */
@media (prefers-color-scheme: dark) {
  .custom-toolbar {
    --background: rgba(17, 24, 39, 0.95);
    --color: #f9fafb;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }

  .custom-title {
    color: #f9fafb;
  }

  .custom-back-button {
    --color: #9ca3af;
  }

  .custom-back-button:hover {
    --color: #ec4899;
  }
}
</style>
