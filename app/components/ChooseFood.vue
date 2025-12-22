<script lang="ts" setup>
import type { StuffItem } from '~/types'
import { storeToRefs } from 'pinia'
import { useEmojiAnimation } from '~/composables/animation'
import { useIncompatibleFoods } from '~/composables/incompatible-foods'

import { meat, staple, tools, vegetable } from '~/data/food'

const rStore = useRecipeStore()
const { curTool } = storeToRefs(rStore)
const curStuff = computed(() => rStore.selectedStuff)

// 食物相克检测
const { warningMessage, hasWarning, checkIncompatibility } = useIncompatibleFoods()

const recipeBtnRef = ref<HTMLButtonElement>()
const { playAnimation } = useEmojiAnimation(recipeBtnRef)

const { proxy } = useScriptGoogleTagManager()

const recipePanelRef = ref()

// 监听食材变化，自动检测相克
watch(curStuff, (newIngredients) => {
  checkIncompatibility(newIngredients)
}, { deep: true })

// 页面初始化时也检查一次（处理已有选择的情况）
onMounted(() => {
  if (curStuff.value.length > 0) {
    checkIncompatibility(curStuff.value)
  }
})

function toggleStuff(item: StuffItem, category = '', _e?: Event) {
  rStore.toggleStuff(item.name)

  if (curStuff.value.includes(item.name))
    playAnimation(item.emoji)

  proxy.dataLayer.push({
    event: 'click',
    category: `${category}_${item.name}`,
    action: 'click_stuff',
    label: '食材',
  })
  proxy.dataLayer.push({
    event: 'click_stuff',
    action: item.name,
  })
}
</script>

<template>
  <div class="p-4 pb-24 space-y-6">
    <div class="flex items-center justify-between">
      <h2 class="text-xl font-bold flex items-center gap-2">
        <div class="i-carbon-restaurant" />
        <span>Una 今天想吃点什么？</span>
      </h2>
    </div>

    <!-- 食物相克警告提示 -->
    <ion-toast
      class="incompatible-warning-toast"
      :message="warningMessage"
      :is-open="hasWarning"
      position="top"
      :icon="ioniconsWarningOutline"
      animated
    >
      <div
        v-if="hasWarning"
        class="incompatible-warning-box"
        m="b-4" p="4"
        border="~ 2 red-300 dark:red-600 rounded-xl"
        text="red-800 dark:red-200 sm"
        shadow="lg"
        relative="~"
        overflow="hidden"
      >
        <div flex="~ items-start gap-3">
          <div text="2xl" flex="shrink-0" class="animate-pulse">
            🚨
          </div>
          <div flex="1 col gap-1">
            <div font="bold" text="base">
              食物相克警告！
            </div>
            <div leading="relaxed" whitespace="pre-line">
              {{ warningMessage }}
            </div>
          </div>
        </div>
      </div>
    </ion-toast>

    <!-- 蔬菜 -->
    <section class="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm">
      <h2 class="text-base font-bold mb-3 flex items-center gap-2 text-green-600 dark:text-green-400">
        <span class="text-xl">🥬</span>
        <span>菜菜们</span>
      </h2>
      <div class="flex flex-wrap gap-2">
        <VegetableTag
          v-for="item, i in vegetable" :key="i"
          :active="curStuff.includes(item.name)"
          @click="toggleStuff(item, 'vegetable')"
        >
          <span v-if="item.emoji" class="inline-flex">{{ item.emoji }}</span>
          <span v-else-if="item.image" class="inline-flex">
            <img class="inline-flex" w="2" h="2" width="10" height="10" :src="item.image" :alt="item.name">
          </span>
          <span class="inline-flex" m="l-1">{{ item.name }}</span>
        </VegetableTag>
      </div>
    </section>

    <!-- 肉类 -->
    <section class="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm">
      <h2 class="text-base font-bold mb-3 flex items-center gap-2 text-red-500 dark:text-red-400">
        <span class="text-xl">🥩</span>
        <span>肉肉们</span>
      </h2>
      <div class="flex flex-wrap gap-2">
        <MeatTag
          v-for="item, i in meat" :key="i"
          :active="curStuff.includes(item.name)"
          @click="toggleStuff(item, 'meat')"
        >
          <span>{{ item.emoji }}</span>
          <span m="l-1">{{ item.name }}</span>
        </MeatTag>
      </div>
    </section>

    <!-- 主食 -->
    <section class="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm">
      <h2 class="text-base font-bold mb-3 flex items-center gap-2 text-yellow-600 dark:text-yellow-400">
        <span class="text-xl">🍚</span>
        <span>主食</span>
        <span class="text-xs font-normal opacity-60 ml-auto">可选</span>
      </h2>
      <div class="flex flex-wrap gap-2">
        <StapleTag
          v-for="item, i in staple" :key="i"
          :active="curStuff.includes(item.name)"
          @click="toggleStuff(item, 'staple')"
        >
          <span>{{ item.emoji }}</span>
          <span m="l-1">{{ item.name }}</span>
        </StapleTag>
      </div>
    </section>

    <!-- 厨具 -->
    <section class="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm">
      <h2 class="text-base font-bold mb-3 flex items-center gap-2 text-gray-600 dark:text-gray-300">
        <span class="text-xl">🍳</span>
        <span>厨具</span>
      </h2>
      <div class="flex flex-wrap gap-2">
        <ToolTag
          v-for="item, i in tools" :key="i"
          :active="curTool === item.name"
          @click="rStore.clickTool(item)"
        >
          <span v-if="item.emoji" class="inline-flex">
            {{ item.emoji }}
          </span>
          <span v-else-if="item.icon" class="inline-flex">
            <div :class="item.icon" />
          </span>
          <span class="inline-flex" m="l-1">{{ item.label || item.name }}</span>
        </ToolTag>
      </div>
    </section>

    <RecipePanel ref="recipePanelRef" />
  </div>

  <Transition>
    <BasketButton ref="recipeBtnRef" />
  </Transition>
</template>

<style>
ion-toast.incompatible-warning-toast {
  /* --background: #f4f4fa; */
  --box-shadow: 3px 3px 10px 0 rgba(0, 0, 0, 0.2);
  /* --color: #4b4a50; */
  --background: rgba(254, 202, 202, 0.95);
  --color: #7f1d1d;
}
</style>
