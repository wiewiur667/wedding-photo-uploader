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
  <v-card
    v-press="{
      click: () => $emit('open'),
      dblclick: () => $emit('react'),
    }"
    flat
    class="relative touch-manipulation gap-1 overflow-hidden bg-transparent"
  >
    <v-img
      :src="`/api/uploads/${upload.id}`"
      :alt="upload.name"
      :aspect-ratio="9 / 12"
      lazy-src="https://picsum.photos/id/11/100/60"
      cover
      rounded="md"
    >
      <template #placeholder>
        <div class="h-full flex flex-1 items-center justify-center">
          <v-progress-circular
            color="grey-lighten-4"
            indeterminate
          />
        </div>
      </template>
    </v-img>
    <v-card-text
      class="flex flex-col justify-end p-2!"
    >
      <span class="font-semibold">{{ upload.byName }}</span>
      <div class="flex gap-3">
        <div class="flex items-center gap-2 text-sm">
          <Icon :name="upload.commentsCount ? 'mdi:comment' : 'mdi:comment-outline'" />
          <span>{{ upload.commentsCount ?? 0 }}</span>
        </div>
        <div class="flex items-center gap-2 text-sm">
          <Icon
            :name="upload.reacted ? 'mdi:heart' : 'mdi:heart-outline'"
            color="red"
          />
          <span>{{ upload.reactionsCount ?? 0 }}</span>
        </div>
      </div>
    </v-card-text>
  </v-card>
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
