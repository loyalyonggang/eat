<script lang="ts" setup>
import type { IonSearchbarCustomEvent, SearchbarInputEventDetail } from '@ionic/core'
import type { DbRecipeItem } from '~/utils/db'
import { Dialog } from '@capacitor/dialog'
import { getFavoriteTime, isFavorited, toggleFavorite } from '~/composables/store/favorite'
import { db } from '~/utils/db'

definePageMeta({
  layout: 'child',
  title: '我的收藏',
})

const loading = ref(false)
const recipes = ref<DbRecipeItem[]>([])
const keyword = ref('')
const sortKey = ref<'time' | 'name'>('time')

const displayed = computed(() => {
  const text = keyword.value.trim()
  let list = recipes.value
  if (text)
    list = list.filter(r => r.name.includes(text))

  if (sortKey.value === 'name')
    return [...list].sort((a, b) => a.name.localeCompare(b.name))

  // time: sort by recorded favorite timestamp (recent first)
  return [...list].sort((a, b) => {
    const ta = getFavoriteTime(a) ?? -Infinity
    const tb = getFavoriteTime(b) ?? -Infinity
    return tb - ta
  })
})

async function loadFavorites() {
  loading.value = true
  try {
    const all = await db.recipes.toArray()
    recipes.value = all.filter(r => isFavorited(r))
  }
  finally {
    loading.value = false
  }
}

onMounted(loadFavorites)

async function clearAllFavorites() {
  const result = await Dialog.confirm({
    title: '清空收藏',
    message: '确定要取消所有收藏吗？',
    okButtonTitle: '确认',
    cancelButtonTitle: '取消',
  })
  if (result.value) {
    for (const item of recipes.value)
      toggleFavorite(item)
    await loadFavorites()
  }
}

function onToggleFavorite(item: DbRecipeItem) {
  toggleFavorite(item)
  // update list immediately
  recipes.value = recipes.value.filter(r => isFavorited(r))
}

function openDishLink(item: DbRecipeItem) {
  const href = item.link || `https://www.bilibili.com/video/${item.bv}`
  window.open(href, '_blank')
}
</script>

<template>
  <ion-page>
    <CustomHeader title="我的收藏" :show-back-button="true" back-href="/my">
      <template #end-buttons>
        <ion-button title="清空收藏" fill="clear" @click="clearAllFavorites">
          <ion-icon slot="icon-only" :icon="ioniconsTrashOutline" />
        </ion-button>
      </template>
    </CustomHeader>

    <div class="sticky top-0 z-10 bg-gray-50/80 px-4 pb-2 backdrop-blur-md dark:bg-black/80">
      <ion-searchbar
        animated
        placeholder="搜索收藏"
        :debounce="300"
        show-clear-button="focus"
        class="custom-searchbar"
        @ion-input="(ev: IonSearchbarCustomEvent<SearchbarInputEventDetail>) => (keyword = ev.detail.value ?? '')"
        @ion-clear="keyword = ''"
      />

      <div class="mt-2">
        <ion-segment
          :value="sortKey"
          class="custom-segment"
          @ion-change="e => (sortKey = (e.detail.value as 'time' | 'name') ?? 'time')"
        >
          <ion-segment-button value="time">
            <ion-label>按收藏时间</ion-label>
          </ion-segment-button>
          <ion-segment-button value="name">
            <ion-label>按名称</ion-label>
          </ion-segment-button>
        </ion-segment>
      </div>
    </div>

    <ion-content>
      <div v-if="loading" class="ion-padding text-center">
        <ion-spinner name="crescent" />
      </div>

      <ion-list v-else-if="displayed.length">
        <ion-item-sliding v-for="item in displayed" :key="item.id ?? item.name">
          <ion-item @click="openDishLink(item)">
            <ion-label class="truncate">
              <DishLabel class="text-sm" :dish="item" />
            </ion-label>
            <ion-icon slot="end" :icon="ioniconsStar" color="warning" />
          </ion-item>

          <ion-item-options>
            <ion-item-option color="medium" @click="onToggleFavorite(item)">
              取消收藏
            </ion-item-option>
          </ion-item-options>
        </ion-item-sliding>
      </ion-list>

      <div v-else class="ion-padding text-center">
        <ion-note>还没有收藏的菜谱</ion-note>
      </div>
    </ion-content>
  </ion-page>
</template>

<style scoped>
.custom-searchbar {
  --background: rgba(var(--gray-200), 0.5);
  --border-radius: 12px;
  --box-shadow: none;
  padding-inline: 0;
}

.dark .custom-searchbar {
  --background: rgba(var(--gray-800), 0.5);
}

.custom-segment {
  --background: transparent;
}
</style>
