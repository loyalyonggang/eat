<script lang="ts" setup>
import { nextTick, ref } from 'vue'

definePageMeta({
  alias: ['/chat'],
})

interface Message {
  role: 'user' | 'assistant'
  content: string
}

const messages = ref<Message[]>([
  {
    role: 'assistant',
    content: 'Una，今天想吃点什么？我是你的专属大厨，随时为你待命！👨‍🍳',
  },
])

const inputMessage = ref('')
const isLoading = ref(false)
const contentRef = ref()

async function scrollToBottom() {
  await nextTick()
  if (contentRef.value) {
    contentRef.value.$el.scrollToBottom(300)
  }
}

async function sendMessage() {
  if (!inputMessage.value.trim() || isLoading.value)
    return

  const userMsg = inputMessage.value.trim()
  messages.value.push({ role: 'user', content: userMsg })
  inputMessage.value = ''
  isLoading.value = true
  await scrollToBottom()

  try {
    const response = await $fetch<{ content: string }>('/api/chat', {
      method: 'POST',
      body: {
        messages: messages.value.map(m => ({
          role: m.role,
          content: m.content,
        })),
      },
    })

    if (response && response.content) {
      messages.value.push({
        role: 'assistant',
        content: response.content,
      })
    }
  }
  catch (error) {
    console.error('Chat error:', error)
    messages.value.push({
      role: 'assistant',
      content: '哎呀，厨房太忙了，信号不太好，待会再试一下吧！😓',
    })
  }
  finally {
    isLoading.value = false
    await scrollToBottom()
  }
}
</script>

<template>
  <ion-page>
    <CustomHeader title="花大厨 ❤️ Una" />

    <ion-content ref="contentRef" class="bg-gray-100 dark:bg-gray-900" :scroll-events="true">
      <div class="flex flex-col gap-4 p-4 pb-20">
        <div
          v-for="(msg, index) in messages"
          :key="index"
          class="flex items-start gap-3"
          :class="msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'"
        >
          <!-- Avatar -->
          <div
            class="h-10 w-10 flex flex-shrink-0 items-center justify-center rounded-lg shadow-sm"
            :class="msg.role === 'user' ? 'bg-pink-100' : 'bg-white'"
          >
            <div v-if="msg.role === 'user'" class="text-xl">
              👩
            </div>
            <div v-else class="text-xl">
              👨‍🍳
            </div>
          </div>

          <!-- Message Bubble -->
          <div
            class="relative max-w-[75%] break-words rounded-lg px-4 py-2.5 text-base leading-relaxed shadow-sm"
            :class="[
              msg.role === 'user'
                ? 'bg-[#95EC69] text-black after:border-l-[#95EC69]' // WeChat Green
                : 'bg-white text-black dark:bg-gray-800 dark:text-white after:border-r-white dark:after:border-r-gray-800',
            ]"
          >
            <!-- Triangle Arrow -->
            <div
              class="absolute top-3 h-0 w-0 border-[6px] border-transparent"
              :class="msg.role === 'user' ? '-right-3 border-l-[#95EC69]' : '-left-3 border-r-white dark:border-r-gray-800'"
            />
            {{ msg.content }}
          </div>
        </div>

        <div v-if="isLoading" class="flex items-start gap-3">
          <div class="h-10 w-10 flex items-center justify-center rounded-lg bg-white shadow-sm">
            <div class="text-xl">
              👨‍🍳
            </div>
          </div>
          <div class="rounded-lg bg-white px-4 py-3 shadow-sm">
            <div class="flex gap-1">
              <div class="h-2 w-2 animate-bounce rounded-full bg-gray-400" style="animation-delay: 0s" />
              <div class="h-2 w-2 animate-bounce rounded-full bg-gray-400" style="animation-delay: 0.2s" />
              <div class="h-2 w-2 animate-bounce rounded-full bg-gray-400" style="animation-delay: 0.4s" />
            </div>
          </div>
        </div>
      </div>
    </ion-content>

    <ion-footer class="ion-no-border">
      <ion-toolbar class="border-t border-gray-200 bg-gray-50 px-2 py-2 dark:border-gray-800 dark:bg-gray-900">
        <div class="flex items-end gap-2">
          <textarea
            v-model="inputMessage"
            rows="1"
            class="max-h-[100px] min-h-[40px] flex-1 resize-none rounded-xl border-none bg-white px-4 py-2 text-base dark:bg-gray-800 focus:ring-0"
            placeholder="问问花大厨..."
            @keydown.enter.prevent="sendMessage"
          />
          <button
            class="h-10 rounded-xl px-4 font-medium transition-colors duration-200"
            :class="inputMessage.trim() ? 'bg-[#95EC69] text-black hover:bg-[#85D65D]' : 'bg-gray-200 text-gray-400 dark:bg-gray-700'"
            :disabled="!inputMessage.trim() || isLoading"
            @click="sendMessage"
          >
            发送
          </button>
        </div>
      </ion-toolbar>
    </ion-footer>
  </ion-page>
</template>

<style scoped>
ion-content {
  --background: #f3f4f6;
}

.dark ion-content {
  --background: #111827;
}

/* Hide scrollbar for textarea */
textarea::-webkit-scrollbar {
  display: none;
}
</style>
