<script lang="ts" setup>
interface Props {
  label?: string
  action?: () => void
  to?: string
}

defineProps<Props>()
</script>

<template>
  <a v-if="to" class="flex items-center justify-center px-4 py-2" :href="to">
    <div class="flex flex-1 items-center justify-center">
      <slot>
        <span>{{ label }}</span>
      </slot>
    </div>
  </a>
  <button
    v-else class="
    flex
    items-center
    justify-center
    px-4
    py-2
    rounded-lg
    overflow-hidden
    transition-all
    duration-100
    [&>*]:(pointer-events-none touch-none select-none)"
    v-bind="$attrs"
    @click="action"
  >
    <slot>
      <span>{{ label }}</span>
    </slot>
  </button>
</template>

<style>

</style>
