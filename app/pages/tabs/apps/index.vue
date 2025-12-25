<script setup lang="ts">
definePageMeta({
  alias: ['/apps'],
})

useHead({
  title: '发现',
})

// 打开外部链接
function openVideoSite() {
  window.open('https://hbqtv.xzgg.us.kg/', '_blank')
}
</script>

<template>
  <ion-page>
    <CustomHeader title="发现" />

    <ion-content class="custom-content bg-gray-50 dark:bg-black">
      <div class="grid gap-4 p-4">
        <!-- Main Feature Card - Una 今天吃什么 -->
        <div
          class="relative cursor-pointer overflow-hidden rounded-2xl from-orange-500 via-amber-500 to-yellow-500 bg-gradient-to-r p-6 shadow-lg transition-transform active:scale-98"
          @click="$router.push('/apps/random')"
        >
          <!-- Food decoration -->
          <div class="absolute right-4 top-2 animate-pulse text-4xl text-white/20">
            🍽️
          </div>
          <div class="absolute bottom-2 left-4 animate-bounce text-2xl text-white/20">
            🥘
          </div>
          <div class="absolute right-8 top-1/2 animate-pulse text-6xl text-white/10">
            🍳
          </div>

          <div class="relative z-10 mb-4 flex items-center gap-4">
            <div class="h-12 w-12 flex items-center justify-center rounded-full bg-white/20 text-2xl text-white">
              🎲
            </div>
            <div>
              <h3 class="text-lg text-white font-bold">
                Una 今天吃什么
              </h3>
              <p class="text-sm text-white/80">
                不知道吃什么？随机选一个 🍽️✨
              </p>
            </div>
            <div class="ml-auto text-white/80">
              <div i-ri-arrow-right-s-line class="text-2xl" />
            </div>
          </div>
        </div>

        <!-- Una Days Counter Card -->
        <div
          class="relative cursor-pointer overflow-hidden rounded-2xl from-pink-500 via-purple-500 to-indigo-600 bg-gradient-to-r p-6 shadow-lg transition-transform active:scale-98"
          @click="$router.push('/apps/christmas-tree')"
        >
          <!-- 浪漫装饰 -->
          <div class="absolute right-4 top-2 animate-pulse text-4xl text-white/20">
            💕
          </div>
          <div class="absolute bottom-2 left-4 animate-bounce text-2xl text-white/20">
            💖
          </div>
          <div class="absolute right-8 top-1/2 animate-pulse text-6xl text-white/10">
            💗
          </div>

          <div class="relative z-10 mb-4 flex items-center gap-4">
            <div class="h-12 w-12 flex items-center justify-center rounded-full bg-white/20 text-2xl text-white">
              💕
            </div>
            <div>
              <h3 class="text-lg text-white font-bold">
                Una 相恋几天
              </h3>
              <p class="text-sm text-white/80">
                时间记录着我们的美好 💕✨
              </p>
            </div>
            <div class="ml-auto text-white/80">
              <div i-ri-arrow-right-s-line class="text-2xl" />
            </div>
          </div>
        </div>

        <!-- Una Video Card -->
        <div
          class="relative cursor-pointer overflow-hidden rounded-2xl from-blue-600 via-cyan-500 to-teal-500 bg-gradient-to-r p-6 shadow-lg transition-transform active:scale-98"
          @click="openVideoSite"
        >
          <!-- Video decoration -->
          <div class="absolute right-4 top-2 animate-pulse text-4xl text-white/20">
            📺
          </div>
          <div class="absolute bottom-2 left-4 animate-bounce text-2xl text-white/20">
            🎬
          </div>
          <div class="absolute right-8 top-1/2 animate-pulse text-6xl text-white/10">
            🍿
          </div>

          <div class="relative z-10 mb-4 flex items-center gap-4">
            <div class="h-12 w-12 flex items-center justify-center rounded-full bg-white/20 text-2xl text-white">
              🎥
            </div>
            <div>
              <h3 class="text-lg text-white font-bold">
                Una 今天想看什么视频
              </h3>
              <p class="text-sm text-white/80">
                精彩视频等你来看 📺🍿
              </p>
            </div>
            <div class="ml-auto text-white/80">
              <div i-ri-external-link-line class="text-2xl" />
            </div>
          </div>
        </div>

        <!-- Truth or Dare Game Card -->
        <div
          class="relative cursor-pointer overflow-hidden rounded-2xl from-rose-500 via-pink-500 to-red-500 bg-gradient-to-r p-6 shadow-lg transition-transform active:scale-98"
          @click="$router.push('/apps/truth-or-dare')"
        >
          <!-- Game decoration -->
          <div class="absolute right-4 top-2 animate-pulse text-4xl text-white/20">
            💕
          </div>
          <div class="absolute bottom-2 left-4 animate-bounce text-2xl text-white/20">
            🎯
          </div>
          <div class="absolute right-8 top-1/2 animate-pulse text-6xl text-white/10">
            💖
          </div>

          <div class="relative z-10 mb-4 flex items-center gap-4">
            <div class="h-12 w-12 flex items-center justify-center rounded-full bg-white/20 text-2xl text-white">
              🎲
            </div>
            <div>
              <h3 class="text-lg text-white font-bold">
                Una 想玩真心话大冒险吗
              </h3>
              <p class="text-sm text-white/80">
                增进感情的浪漫游戏 💕🎯
              </p>
            </div>
            <div class="ml-auto text-white/80">
              <div i-ri-arrow-right-s-line class="text-2xl" />
            </div>
          </div>
        </div>

        <!-- Sweet Talk Card -->
        <div
          class="relative cursor-pointer overflow-hidden rounded-2xl from-purple-600 via-violet-500 to-indigo-500 bg-gradient-to-r p-6 shadow-lg transition-transform active:scale-98"
          @click="$router.push('/apps/sweet-talk')"
        >
          <!-- Sweet talk decoration -->
          <div class="absolute right-4 top-2 animate-pulse text-4xl text-white/20">
            💬
          </div>
          <div class="absolute bottom-2 left-4 animate-bounce text-2xl text-white/20">
            😘
          </div>
          <div class="absolute right-8 top-1/2 animate-pulse text-6xl text-white/10">
            💝
          </div>

          <div class="relative z-10 mb-4 flex items-center gap-4">
            <div class="h-12 w-12 flex items-center justify-center rounded-full bg-white/20 text-2xl text-white">
              💌
            </div>
            <div>
              <h3 class="text-lg text-white font-bold">
                Una 想听土味情话吗
              </h3>
              <p class="text-sm text-white/80">
                100条甜蜜情话等你来听 💌😘
              </p>
            </div>
            <div class="ml-auto text-white/80">
              <div i-ri-arrow-right-s-line class="text-2xl" />
            </div>
          </div>
        </div>

        <!-- Period Care Card -->
        <div
          class="relative cursor-pointer overflow-hidden rounded-2xl from-pink-600 via-rose-500 to-red-500 bg-gradient-to-r p-6 shadow-lg transition-transform active:scale-98"
          @click="$router.push('/apps/period-care')"
        >
          <!-- Period care decoration -->
          <div class="absolute right-4 top-2 animate-pulse text-4xl text-white/20">
            🌸
          </div>
          <div class="absolute bottom-2 left-4 animate-bounce text-2xl text-white/20">
            💖
          </div>
          <div class="absolute right-8 top-1/2 animate-pulse text-6xl text-white/10">
            🤗
          </div>

          <div class="relative z-10 mb-4 flex items-center gap-4">
            <div class="h-12 w-12 flex items-center justify-center rounded-full bg-white/20 text-2xl text-white">
              🌺
            </div>
            <div>
              <h3 class="text-lg text-white font-bold">
                Una 有肚子不疼偏方吗
              </h3>
              <p class="text-sm text-white/80">
                温暖的陪伴和舒缓体验 🌸💖
              </p>
            </div>
            <div class="ml-auto text-white/80">
              <div i-ri-arrow-right-s-line class="text-2xl" />
            </div>
          </div>
        </div>

        <!-- Recommendations Grid -->
        <h3 class="ml-2 mt-4 text-sm text-gray-500 font-bold tracking-wider uppercase">
          精选推荐
        </h3>
        <div class="grid grid-cols-2 gap-4">
          <!-- 懒人模式 -->
          <div
            class="cursor-pointer rounded-2xl bg-white p-4 shadow-sm transition-transform active:scale-95 dark:bg-gray-800"
            @click="$router.push('/library?q=简单')"
          >
            <div class="mb-3 h-10 w-10 flex items-center justify-center rounded-full bg-blue-100 text-xl text-blue-500 dark:bg-blue-900/30">
              <div i-mdi-sleep />
            </div>
            <h4 class="text-gray-800 font-bold dark:text-gray-100">
              懒人模式
            </h4>
            <p class="mt-1 text-xs text-gray-500">
              简单易做不翻车
            </p>
          </div>

          <!-- 复刻美食 -->
          <div
            class="cursor-pointer rounded-2xl bg-white p-4 shadow-sm transition-transform active:scale-95 dark:bg-gray-800"
            @click="$router.push('/library?q=同款')"
          >
            <div class="mb-3 h-10 w-10 flex items-center justify-center rounded-full bg-red-100 text-xl text-red-500 dark:bg-red-900/30">
              <div i-mdi-food-drumstick-outline />
            </div>
            <h4 class="text-gray-800 font-bold dark:text-gray-100">
              复刻美食
            </h4>
            <p class="mt-1 text-xs text-gray-500">
              在家还原大牌味
            </p>
          </div>

          <!-- 下午茶 -->
          <div
            class="cursor-pointer rounded-2xl bg-white p-4 shadow-sm transition-transform active:scale-95 dark:bg-gray-800"
            @click="$router.push('/library?q=蛋糕')"
          >
            <div class="mb-3 h-10 w-10 flex items-center justify-center rounded-full bg-pink-100 text-xl text-pink-500 dark:bg-pink-900/30">
              <div i-mdi-cupcake />
            </div>
            <h4 class="text-gray-800 font-bold dark:text-gray-100">
              甜蜜时光
            </h4>
            <p class="mt-1 text-xs text-gray-500">
              蛋糕甜点下午茶
            </p>
          </div>

          <!-- 深夜食堂 -->
          <div
            class="cursor-pointer rounded-2xl bg-white p-4 shadow-sm transition-transform active:scale-95 dark:bg-gray-800"
            @click="$router.push('/library?q=烧烤')"
          >
            <div class="mb-3 h-10 w-10 flex items-center justify-center rounded-full bg-purple-100 text-xl text-purple-500 dark:bg-purple-900/30">
              <div i-mdi-grill />
            </div>
            <h4 class="text-gray-800 font-bold dark:text-gray-100">
              深夜食堂
            </h4>
            <p class="mt-1 text-xs text-gray-500">
              烧烤炸鸡配啤酒
            </p>
          </div>
        </div>

        <!-- More features can be added here -->
      </div>
    </ion-content>
  </ion-page>
</template>

<style scoped>
.custom-content {
  --padding-top: 0;
  --padding-bottom: 0;
}
</style>
