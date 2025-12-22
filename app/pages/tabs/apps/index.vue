<script setup lang="ts">
definePageMeta({
  alias: ['/apps'],
})

useHead({
  title: '发现',
})
</script>

<template>
  <ion-page>
    <ion-header class="ion-no-border">
      <ion-toolbar class="bg-transparent">
        <ion-title>
          发现
        </ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="bg-gray-50 dark:bg-black">
      <div class="p-4 grid gap-4">
        <!-- Main Feature Card -->
        <div
          class="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm active:scale-98 transition-transform cursor-pointer"
          @click="$router.push('/apps/random')"
        >
          <div class="flex items-center gap-4 mb-4">
            <div class="w-12 h-12 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-2xl text-orange-500">
              <div i-mdi-dice-multiple-outline />
            </div>
            <div>
              <h3 class="text-lg font-bold text-gray-800 dark:text-gray-100">
                Una 今天吃什么
              </h3>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                不知道吃什么？随机选一个
              </p>
            </div>
            <div class="ml-auto text-gray-400">
              <div i-ri-arrow-right-s-line class="text-2xl" />
            </div>
          </div>
        </div>

        <!-- Christmas Tree Card -->
        <div
          class="bg-gradient-to-r from-green-600 to-green-500 rounded-2xl p-6 shadow-lg active:scale-98 transition-transform cursor-pointer relative overflow-hidden"
          @click="$router.push('/apps/christmas-tree')"
        >
          <!-- Snowflakes decoration -->
          <div class="absolute top-2 right-4 text-white/20 text-4xl animate-pulse">❄️</div>
          <div class="absolute bottom-2 left-4 text-white/20 text-2xl animate-bounce">❄️</div>
          
          <div class="flex items-center gap-4 mb-4 relative z-10">
            <div class="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-2xl text-white">
              <div i-mdi-pine-tree />
            </div>
            <div>
              <h3 class="text-lg font-bold text-white">
                Una 你见过会唱歌的圣诞树么
              </h3>
              <p class="text-sm text-white/80">
                点进来，有惊喜哦 🎄✨
              </p>
            </div>
            <div class="ml-auto text-white/80">
              <div i-ri-arrow-right-s-line class="text-2xl" />
            </div>
          </div>
        </div>

        <!-- Recommendations Grid -->
        <h3 class="text-sm font-bold text-gray-500 uppercase tracking-wider mt-4 ml-2">
          精选推荐
        </h3>
        <div class="grid grid-cols-2 gap-4">
          <!-- 懒人模式 -->
          <div
            class="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm active:scale-95 transition-transform cursor-pointer"
            @click="$router.push('/library?q=简单')"
          >
            <div class="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-xl text-blue-500 mb-3">
              <div i-mdi-sleep />
            </div>
            <h4 class="font-bold text-gray-800 dark:text-gray-100">懒人模式</h4>
            <p class="text-xs text-gray-500 mt-1">简单易做不翻车</p>
          </div>

          <!-- 复刻美食 -->
          <div
            class="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm active:scale-95 transition-transform cursor-pointer"
            @click="$router.push('/library?q=同款')"
          >
            <div class="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-xl text-red-500 mb-3">
              <div i-mdi-food-drumstick-outline />
            </div>
            <h4 class="font-bold text-gray-800 dark:text-gray-100">复刻美食</h4>
            <p class="text-xs text-gray-500 mt-1">在家还原大牌味</p>
          </div>

          <!-- 下午茶 -->
          <div
            class="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm active:scale-95 transition-transform cursor-pointer"
            @click="$router.push('/library?q=蛋糕')"
          >
            <div class="w-10 h-10 rounded-full bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center text-xl text-pink-500 mb-3">
              <div i-mdi-cupcake />
            </div>
            <h4 class="font-bold text-gray-800 dark:text-gray-100">甜蜜时光</h4>
            <p class="text-xs text-gray-500 mt-1">蛋糕甜点下午茶</p>
          </div>

          <!-- 深夜食堂 -->
          <div
            class="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm active:scale-95 transition-transform cursor-pointer"
            @click="$router.push('/library?q=烧烤')"
          >
            <div class="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-xl text-purple-500 mb-3">
              <div i-mdi-grill />
            </div>
            <h4 class="font-bold text-gray-800 dark:text-gray-100">深夜食堂</h4>
            <p class="text-xs text-gray-500 mt-1">烧烤炸鸡配啤酒</p>
          </div>
        </div>

        <!-- More features can be added here -->
      </div>
    </ion-content>
  </ion-page>
</template>
