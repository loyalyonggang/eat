<script setup lang="ts">
import type { StoryEgg } from '~/types'

interface Props {
  egg: StoryEgg
  visible: boolean
}

interface Emits {
  (e: 'close'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

function close() {
  emit('close')
}
</script>

<template>
  <Teleport to="body">
    <Transition name="egg-fade">
      <div
        v-if="visible"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
        @click="close"
      >
        <Transition name="egg-scale">
          <div
            v-if="visible"
            class="relative w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl dark:bg-gray-800"
            @click.stop
          >
            <!-- 关闭按钮 -->
            <button
              class="absolute right-4 top-4 z-10 h-10 w-10 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 transition-transform active:scale-90 dark:bg-gray-700 dark:text-gray-300"
              @click="close"
            >
              <div i-ri-close-line class="text-xl" />
            </button>

            <!-- 彩蛋图标 -->
            <div class="flex items-center justify-center bg-gradient-to-br from-emerald-500 to-cyan-500 py-12">
              <div class="animate-bounce text-6xl">
                {{ egg.icon || '🎁' }}
              </div>
            </div>

            <!-- 彩蛋内容 -->
            <div class="p-6">
              <h3 class="mb-4 text-center text-2xl text-gray-800 font-bold dark:text-gray-100">
                {{ egg.title }}
              </h3>
              <div class="text-gray-600 leading-relaxed dark:text-gray-300" v-html="egg.content" />
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.egg-fade-enter-active,
.egg-fade-leave-active {
  transition: opacity 0.3s ease;
}

.egg-fade-enter-from,
.egg-fade-leave-to {
  opacity: 0;
}

.egg-scale-enter-active,
.egg-scale-leave-active {
  transition: all 0.3s ease;
}

.egg-scale-enter-from,
.egg-scale-leave-to {
  opacity: 0;
  transform: scale(0.8);
}
</style>
