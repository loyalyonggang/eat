<script lang="ts" setup>
const { count, inc, dec } = useCount()
const { random, randomRecipes } = useRandomRecipe(count)
</script>

<template>
  <div class="w-full max-w-md space-y-8 p-4">
    <!-- Control Card -->
    <div class="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-sm text-center space-y-8">
      <div>
        <h2 class="text-lg font-medium text-gray-600 dark:text-gray-300 mb-6">
          Una 今天想吃几道菜？
        </h2>
        
        <div class="flex items-center justify-center gap-8">
          <button 
            class="w-14 h-14 rounded-full bg-gray-50 dark:bg-gray-700 flex items-center justify-center text-xl transition-all duration-200 active:scale-90 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300"
            @click="dec()"
          >
            <div i-ri-subtract-line />
          </button>
          
          <div class="w-20 text-center">
            <span class="text-5xl font-bold text-gray-800 dark:text-white font-mono tracking-tighter">
              {{ count }}
            </span>
          </div>
          
          <button 
            class="w-14 h-14 rounded-full bg-gray-50 dark:bg-gray-700 flex items-center justify-center text-xl transition-all duration-200 active:scale-90 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300"
            @click="inc()"
          >
            <div i-ri-add-line />
          </button>
        </div>
      </div>

      <button
        class="w-full py-4 rounded-2xl bg-gradient-to-r from-orange-400 to-orange-500 text-white font-bold text-lg shadow-lg shadow-orange-500/30 flex items-center justify-center gap-2 transition-all duration-200 transform active:scale-95 hover:shadow-xl hover:-translate-y-0.5"
        @click="random"
      >
        <div class="text-xl animate-spin-once" i-ri-refresh-line />
        <span>随机一下</span>
      </button>
    </div>

    <!-- Results -->
    <TransitionGroup 
      name="list" 
      tag="div" 
      class="space-y-3"
      v-show="randomRecipes.length > 0"
    >
      <div key="header" class="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm font-medium px-2 pb-1">
        <div i-ri-magic-line />
        <span>为您推荐</span>
      </div>
      <template v-for="recipe, i in randomRecipes" :key="recipe ? recipe.name : i">
        <DishTag v-if="recipe" :dish="recipe" />
      </template>
    </TransitionGroup>
  </div>
</template>

<style scoped>
.list-move,
.list-enter-active,
.list-leave-active {
  transition: all 0.5s cubic-bezier(0.55, 0, 0.1, 1);
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateY(30px);
}

.list-leave-active {
  position: absolute;
}

.animate-spin-once:active {
  animation: spin 0.5s linear;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>
