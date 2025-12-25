<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'

definePageMeta({
  alias: ['/christmas-tree'],
})

useHead({
  title: 'Una 的专属圣诞树',
})

const isPlaying = ref(false)
const audio = ref<HTMLAudioElement | null>(null)
const showMessage = ref(false)

// Public domain Jingle Bells or similar
const MUSIC_URL = 'https://music.163.com/song/media/outer/url?id=4884294.mp3' // Jingle Bells

onMounted(() => {
  audio.value = new Audio(MUSIC_URL)
  audio.value.loop = true

  // Auto play might be blocked, so we show a button or try to play
  // simple interaction to start
  setTimeout(() => {
    showMessage.value = true
  }, 1000)
})

onUnmounted(() => {
  if (audio.value) {
    audio.value.pause()
    audio.value = null
  }
})

function toggleMusic() {
  if (!audio.value)
    return

  if (isPlaying.value) {
    audio.value.pause()
  }
  else {
    audio.value.play().catch(() => {
      // Playback failed, likely due to browser autoplay policy
    })
  }
  isPlaying.value = !isPlaying.value
}
</script>

<template>
  <ion-page>
    <CustomHeader title="Una 的圣诞树 🎄" :show-back-button="true" back-href="/apps" :transparent="true" />

    <ion-content class="christmas-bg" :scroll-y="false">
      <div class="relative h-full w-full flex flex-col items-center justify-center overflow-hidden">
        <!-- Snow Effect -->
        <div class="snowflakes" aria-hidden="true">
          <div v-for="n in 10" :key="n" class="snowflake">
            ❅
          </div>
        </div>

        <!-- Tree Container -->
        <div class="tree-container relative z-10 mt-10">
          <div class="star">
            ⭐
          </div>
          <div class="tree-layer top" />
          <div class="tree-layer middle" />
          <div class="tree-layer bottom" />
          <div class="trunk" />

          <!-- Ornaments -->
          <div class="ornament o-1" />
          <div class="ornament o-2" />
          <div class="ornament o-3" />
          <div class="ornament o-4" />
          <div class="ornament o-5" />

          <!-- Lights -->
          <div class="lights-group">
            <div v-for="n in 8" :key="n" class="light" :style="`--i:${n}`" />
          </div>
        </div>

        <!-- Message -->
        <Transition name="fade">
          <div v-if="showMessage" class="absolute bottom-32 z-20 px-6 text-center">
            <div class="border border-white/20 rounded-2xl bg-white/10 p-6 shadow-xl backdrop-blur-md">
              <h2 class="mb-2 text-xl text-white font-bold">
                Merry Christmas, Una! 🍎
              </h2>
              <p class="text-white/90 leading-relaxed">
                愿你的每一天都像这棵树一样<br>
                闪闪发光，充满惊喜。<br>
                记得要好好吃饭，照顾好自己。<br>
                <span class="mt-2 block text-sm opacity-75">永远爱你的男朋友</span>
              </p>
            </div>
          </div>
        </Transition>

        <!-- Controls -->
        <div class="absolute bottom-10 z-20">
          <button
            class="flex items-center gap-2 rounded-full bg-white/20 px-6 py-3 text-white font-medium backdrop-blur transition-all active:scale-95 hover:bg-white/30"
            @click="toggleMusic"
          >
            <div :class="isPlaying ? 'i-mdi-pause' : 'i-mdi-play'" class="text-xl" />
            <span>{{ isPlaying ? '暂停音乐' : '播放音乐' }}</span>
          </button>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<style scoped>
.christmas-bg {
  --background: radial-gradient(circle at center, #1a472a 0%, #0d2615 100%);
}

/* Snowflakes */
.snowflakes {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
}

.snowflake {
  color: #fff;
  font-size: 1em;
  font-family: Arial;
  text-shadow: 0 0 1px #000;
  position: absolute;
  top: -10%;
  z-index: 9999;
  user-select: none;
  cursor: default;
  animation-name: snowflakes-fall, snowflakes-shake;
  animation-duration: 10s, 3s;
  animation-timing-function: linear, ease-in-out;
  animation-iteration-count: infinite, infinite;
  animation-play-state: running, running;
}

.snowflake:nth-of-type(1) {
  left: 1%;
  animation-delay: 0s, 0s;
}
.snowflake:nth-of-type(2) {
  left: 10%;
  animation-delay: 1s, 1s;
}
.snowflake:nth-of-type(3) {
  left: 20%;
  animation-delay: 6s, 0.5s;
}
.snowflake:nth-of-type(4) {
  left: 30%;
  animation-delay: 4s, 2s;
}
.snowflake:nth-of-type(5) {
  left: 40%;
  animation-delay: 2s, 2s;
}
.snowflake:nth-of-type(6) {
  left: 50%;
  animation-delay: 8s, 3s;
}
.snowflake:nth-of-type(7) {
  left: 60%;
  animation-delay: 6s, 2s;
}
.snowflake:nth-of-type(8) {
  left: 70%;
  animation-delay: 2.5s, 1s;
}
.snowflake:nth-of-type(9) {
  left: 80%;
  animation-delay: 1s, 0s;
}
.snowflake:nth-of-type(10) {
  left: 90%;
  animation-delay: 3s, 1.5s;
}

@keyframes snowflakes-fall {
  0% {
    top: -10%;
  }
  100% {
    top: 100%;
  }
}

@keyframes snowflakes-shake {
  0% {
    transform: translateX(0px);
  }
  50% {
    transform: translateX(80px);
  }
  100% {
    transform: translateX(0px);
  }
}

/* Tree Styles */
.tree-container {
  position: relative;
  width: 300px;
  height: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.star {
  font-size: 3rem;
  position: absolute;
  top: -20px;
  z-index: 5;
  animation: twinkle 1s infinite alternate;
  filter: drop-shadow(0 0 10px gold);
}

.tree-layer {
  width: 0;
  height: 0;
  border-left: solid transparent;
  border-right: solid transparent;
  border-bottom: solid #2d5a3f;
  position: absolute;
  filter: drop-shadow(0 5px 5px rgba(0, 0, 0, 0.3));
}

.top {
  border-left-width: 60px;
  border-right-width: 60px;
  border-bottom-width: 80px;
  top: 30px;
  z-index: 3;
}

.middle {
  border-left-width: 90px;
  border-right-width: 90px;
  border-bottom-width: 110px;
  top: 80px;
  z-index: 2;
}

.bottom {
  border-left-width: 120px;
  border-right-width: 120px;
  border-bottom-width: 140px;
  top: 150px;
  z-index: 1;
}

.trunk {
  width: 40px;
  height: 60px;
  background: #5c4033;
  position: absolute;
  bottom: 110px; /* Adjusted based on container height */
  z-index: 0;
}

/* Ornaments */
.ornament {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #ff4d4d;
  position: absolute;
  z-index: 4;
  box-shadow: 0 0 5px #ff4d4d;
}

.o-1 {
  top: 70px;
  left: 130px;
  background: gold;
}
.o-2 {
  top: 110px;
  left: 110px;
}
.o-3 {
  top: 120px;
  left: 170px;
  background: cyan;
}
.o-4 {
  top: 180px;
  left: 90px;
  background: orange;
}
.o-5 {
  top: 190px;
  left: 190px;
}

/* Lights Animation */
@keyframes twinkle {
  0% {
    opacity: 0.5;
    transform: scale(0.9);
  }
  100% {
    opacity: 1;
    transform: scale(1.1);
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 1s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
