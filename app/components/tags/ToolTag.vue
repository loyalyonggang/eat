<script lang="ts" setup>
defineProps<{
  active: boolean
}>()
</script>

<template>
  <button
    class="tag rounded-lg transition-all duration-200 active:scale-95" p="x-3 y-1"
    border="~ stone-200 dark:stone-700"
    :bg="active ? 'stone-600 opacity-100' : 'stone-100 dark:stone-800'"
    :text="active ? 'white' : 'stone-700 dark:stone-300'"
  >
    <slot />
  </button>
</template>
