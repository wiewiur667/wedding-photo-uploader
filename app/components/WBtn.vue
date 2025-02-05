<script lang="ts" setup>
interface Props {
  label?: string
  action?: () => void
  to?: string
}

defineProps<Props>()
</script>

<template>
  <a class="flex items-center justify-center px-4 py-2" :href="to">
    <div class="flex flex-1 items-center justify-center">
      <slot>
        <span>{{ label }}</span>
      </slot>
    </div>
  </a>
</template>

<style>

</style>
