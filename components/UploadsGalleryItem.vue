<script lang="ts" setup>
import { vPress } from '~/code/utils'

interface Props {
  upload: {
    id: string
    type: string
    name: string
    commentsCount?: number
    reactionsCount?: number
    reacted?: boolean
    byName: string
  }
}
defineProps<Props>()

defineEmits(['open', 'react'])
</script>

<template>
  <div
    v-press="{
      click: () => $emit('open'),
      dblclick: () => $emit('react'),
    }"
    class="relative touch-manipulation gap-3 overflow-hidden rounded-md!"
  >
    <v-img
      :src="`/api/uploads/${upload.id}`"
      :alt="upload.name"
      aspect-ratio="1"
      lazy-src="https://picsum.photos/id/11/100/60"
      cover
    >
      <div class="absolute bottom-0 left-0 right-0 h-25% min-h-10 flex flex-col justify-end gap-3 from-black to-black/0 bg-gradient-to-t p-3 text-white">
        <div class="flex gap-3">
          <div class="flex items-center gap-2 text-xs">
            <Icon :name="upload.commentsCount ? 'mdi:comment' : 'mdi:comment-outline'" />
            <span>{{ upload.commentsCount ?? 0 }}</span>
          </div>
          <div class="flex items-center gap-2 text-xs">
            <Icon
              :name="upload.reacted ? 'mdi:heart' : 'mdi:heart-outline'"
              color="red"
            />
            <span>{{ upload.reactionsCount ?? 0 }}</span>
          </div>
        </div>
      </div>
      <template #placeholder>
        <div class="h-full flex flex-1 items-center justify-center">
          <v-progress-circular
            color="grey-lighten-4"
            indeterminate
          />
        </div>
      </template>
    </v-img>
  </div>
</template>

<style lang="scss">
.square {
  position: relative;
  box-sizing: border-box;
  @apply rounded-md;
}

.square::before {
  content: '';
  display: block;
  padding-top: 100%;
}

.square .content {
  position: absolute;
  top: 0; left: 0;
  height: 100%;
  width: 100%;
}
</style>
