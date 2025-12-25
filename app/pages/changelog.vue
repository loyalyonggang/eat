<script setup lang="ts">
import { links } from '~/constants'

// help

// :href="links.changelog" target="_blank"
</script>

<template>
  <ion-page>
    <CustomHeader title="帮助" :show-back-button="true" back-href="/my" />

    <ion-content>
      <ion-list-header>功能日志</ion-list-header>
      <ion-list :inset="true">
        <ion-item>
          <ion-label>
            <h2>v2.0.0-beta (2025-10-07)</h2>
            <p>Beta App 功能</p>
            <p>全新原生界面 UI 适配</p>
            <p>新增历史记录和收藏功能</p>
          </ion-label>
        </ion-item>
      </ion-list>

      <ion-list :inset="true">
        <ion-item :href="links.changelog" target="_blank">
          <ion-label>开发日志</ion-label>
        </ion-item>
        <ion-item :href="links.releaseNotes" target="_blank">
          <ion-label>Release Notes</ion-label>
        </ion-item>
      </ion-list>
    </ion-content>
  </ion-page>
</template>
