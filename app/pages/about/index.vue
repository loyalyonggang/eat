<script setup lang="ts">
import { links } from '~/constants'
</script>

<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/my" />
        </ion-buttons>
        <ion-title>关于</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <TheAboutList />
    </ion-content>
  </ion-page>
</template>
