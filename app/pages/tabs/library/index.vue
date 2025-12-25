<script lang="ts" setup>
import type { IonSearchbarCustomEvent, SearchbarInputEventDetail } from '@ionic/core'
import type { DbRecipeItem } from '~/utils/db'
import { watchDebounced } from '@vueuse/core'
import { computed, onMounted, ref } from 'vue'
import { useIndexedDB } from '~/composables/db'
import { isFavorited, toggleFavorite } from '~/composables/store/favorite'
import { db } from '~/utils/db'

definePageMeta({
  alias: ['/library'],
})

const keyword = ref('')
const loading = ref(false)
const recipes = ref<DbRecipeItem[]>([])
const view = ref<'all' | 'fav'>('all')

const displayed = computed(() => {
  return view.value === 'fav' ? recipes.value.filter(r => isFavorited(r)) : recipes.value
})

const favCount = computed(() => recipes.value.filter(r => isFavorited(r)).length)

const showToast = ref(false)
const toastMessage = ref('')

async function loadAll() {
  loading.value = true
  try {
    recipes.value = await db.recipes.toArray()
  }
  finally {
    loading.value = false
  }
}

async function runSearch(q: string) {
  const text = (q || '').trim()
  if (!text)
    return loadAll()
  loading.value = true
  try {
    recipes.value = await db.recipes
      .filter((r) => {
        const t = text.toLowerCase()
        return !!(
          r.name?.toLowerCase().includes(t)
          || (r.tags && r.tags.some(tag => tag.toLowerCase().includes(t)))
          || (r.stuff && r.stuff.some(s => s.toLowerCase().includes(t)))
          || (r.tools && r.tools.some(tool => tool.toLowerCase().includes(t)))
          || (r.difficulty && r.difficulty.toLowerCase().includes(t))
        )
      })
      .toArray()
  }
  finally {
    loading.value = false
  }
}

const route = useRoute()
const router = useRouter()

onMounted(async () => {
  // ensure IndexedDB has data
  const { init } = useIndexedDB()
  await init()

  // Check for query param
  const q = route.query.q as string
  if (q) {
    keyword.value = q
    await runSearch(q)
  }
  else {
    await loadAll()
  }
})

// Watch URL query changes (e.g. navigation from other tabs)
watch(
  () => route.query.q,
  async (newQ) => {
    const q = (newQ as string) || ''
    if (q !== keyword.value) {
      keyword.value = q
      await runSearch(q)
    }
  },
)

watchDebounced(keyword, (q) => {
  // Update URL to reflect current search
  if (q !== route.query.q) {
    router.replace({ query: { ...route.query, q: q || undefined } })
  }
  runSearch(q)
}, { debounce: 200, maxWait: 500 })

function onInput(ev: IonSearchbarCustomEvent<SearchbarInputEventDetail>) {
  // Ionic emits detail.value
  keyword.value = ev?.detail?.value ?? ''
}

function onClear() {
  keyword.value = ''
}

function onToggleFavorite(item: DbRecipeItem) {
  toggleFavorite(item)
  toastMessage.value = isFavorited(item) ? '已添加到收藏' : '已从收藏移除'
  showToast.value = true
}
</script>

<template>
  <ion-page>
    <CustomHeader title="菜谱列表">
      <template #end-buttons>
        <ion-button title="添加菜谱" router-link="/recipes/new" fill="clear">
          <ion-icon slot="icon-only" :icon="ioniconsAddCircleOutline" />
        </ion-button>
      </template>
    </CustomHeader>

    <div class="sticky top-0 z-10 bg-gray-50/80 px-4 pb-2 backdrop-blur-md dark:bg-black/80">
      <ion-searchbar
        class="custom-searchbar"
        animated
        placeholder="搜索菜谱"
        :debounce="300"
        :value="keyword"
        show-clear-button="focus"
        @ion-input="onInput"
        @ion-clear="onClear"
      />

      <div class="mt-2">
        <ion-segment
          :value="view"
          class="custom-segment"
          @ion-change="e => (view = (e.detail.value as 'all' | 'fav') ?? 'all')"
        >
          <ion-segment-button value="all">
            <ion-label>全部</ion-label>
          </ion-segment-button>
          <ion-segment-button value="fav">
            <ion-label>收藏 ({{ favCount }})</ion-label>
          </ion-segment-button>
        </ion-segment>
      </div>

      <!-- Category Indicator -->
      <div v-if="categoryTitle" class="mt-2 flex items-center">
        <div class="flex animate-fade-in items-center gap-2 rounded-lg bg-green-100 px-3 py-1.5 text-sm text-green-700 font-medium dark:bg-green-900/30 dark:text-green-300">
          <span>正在浏览：{{ categoryTitle }}</span>
          <button class="text-green-500 hover:text-green-700 dark:hover:text-green-200" @click="onClear">
            <div i-mdi-close-circle class="text-lg" />
          </button>
        </div>
      </div>
    </div>

    <ion-content class="bg-gray-50 dark:bg-black">
      <div v-if="loading" class="ion-padding mt-8 text-center">
        <ion-spinner name="crescent" />
      </div>

      <div v-else-if="displayed.length" class="grid gap-3 p-4">
        <div
          v-for="item in displayed"
          :key="item.id ?? item.name"
          class="group relative"
        >
          <DishTag :dish="item" class="!mb-0" />

          <button
            class="absolute right-2 top-2 rounded-full bg-white/80 p-2 backdrop-blur-sm transition-all active:scale-90 dark:bg-black/50"
            :class="isFavorited(item) ? 'text-yellow-500' : 'text-gray-400'"
            @click.stop="onToggleFavorite(item)"
          >
            <ion-icon :icon="isFavorited(item) ? ioniconsStar : ioniconsStarOutline" />
          </button>
        </div>
      </div>

      <div
        v-else-if="(keyword || view === 'fav') && displayed.length === 0"
        class="mt-20 flex flex-col items-center justify-center text-gray-400"
      >
        <div text="4xl" i-mdi-pot-steam-outline mb-4 />
        <p>没有找到相关菜谱</p>
      </div>
    </ion-content>

    <ion-toast
      :is-open="showToast"
      :message="toastMessage"
      duration="1200"
      position="top"
      class="custom-toast"
      @did-dismiss="showToast = false"
    />
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
