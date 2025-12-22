<script lang="ts" setup>
defineProps<{
  active: boolean
}>()
</script>

<template>
  <button
    class="meat-tag tag rounded-lg transition-all duration-200 active:scale-95" p="x-3 y-1"
    border="~ red-200 dark:red-800"
    :bg="active ? 'red-500 opacity-90' : 'red-100 dark:red-900/40'"
    :text="active ? 'white' : 'red-700 dark:red-300'"
  >
    <slot />
  </button>
</template>
