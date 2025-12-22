<script lang="ts" setup>
defineProps<{
  active: boolean
}>()
</script>

<template>
  <button
    class="tag rounded-lg transition-all duration-200 active:scale-95" p="x-3 y-1" 
    border="~ yellow-200 dark:yellow-800"
    :bg="active ? 'yellow-500 dark:yellow-600 opacity-100' : 'yellow-100 dark:yellow-900/40'"
    :text="active ? 'white' : 'yellow-700 dark:yellow-300'"
  >
    <slot />
  </button>
</template>
