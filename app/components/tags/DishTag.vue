<script lang="ts" setup>
import type { RecipeItem } from '~/types'
import type { DbRecipeItem } from '~/utils/db'
import { recipeHistories } from '~/composables/store/history'
import { tools } from '~/data/food'
import { getEmojisFromStuff } from '~/utils'

const props = defineProps<{
  dish: RecipeItem | DbRecipeItem
}>()

const { proxy } = useScriptGoogleTagManager()

function triggerGtm(dish: RecipeItem) {
  recipeHistories.value.push({
    recipe: dish,
    time: Date.now(),
  })

  proxy.dataLayer.push({
    event: 'click',
    category: `dish_${dish.name}`,
    action: 'click_recipe',
    label: '跳转菜谱',
  })
  proxy.dataLayer.push({
    event: 'click_dish',
    action: dish.name,
  })
}

const dishLabel = computed(() => {
  const emojis = getEmojisFromStuff(props.dish.stuff)
  return `${props.dish.tags?.includes('杂烩') ? '🍲' : emojis.join(' ')} ${props.dish.name}`
})
</script>

<template>
  <a
    :href="dish.link || `https://www.bilibili.com/video/${dish.bv}`" target="_blank"
    class="dish-tag tag rounded-lg transition-all duration-200 active:scale-95 hover:shadow-md block w-full mb-2"
    p="x-4 y-3"
    border="~ blue-200 dark:blue-800"
    bg="white dark:gray-800 hover:blue-50 dark:hover:blue-900/20"
    @click="triggerGtm(dish)"
  >
    <div class="flex items-center justify-between w-full">
      <span class="text-base font-medium text-blue-700 dark:text-blue-300 flex-1">
        {{ dishLabel }}
      </span>
      <div class="flex gap-2 ml-2 text-gray-500">
        <template v-for="tool, i in tools">
          <span v-if="dish.tools?.includes(tool.name)" :key="i" :class="tool.icon" />
        </template>
        <div i-ri-arrow-right-s-line />
      </div>
    </div>
  </a>
</template>
