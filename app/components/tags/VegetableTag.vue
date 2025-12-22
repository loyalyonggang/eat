<script lang="ts" setup>
defineProps<{
  active: boolean
}>()
</script>

<template>
  <button
    class="vegetable-tag tag rounded-lg transition-all duration-200 active:scale-95" p="x-3 y-1"
    border="~ green-200 dark:green-800"
    :bg="active ? 'green-600 opacity-90' : 'green-100 dark:green-900/40'"
    :text="active ? 'white' : 'green-700 dark:green-300'"
  >
    <slot />
  </button>
</template>
