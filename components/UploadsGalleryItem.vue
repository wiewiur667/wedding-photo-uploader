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
    class="relative touch-manipulation gap-3 overflow-hidden border rounded-xl!"
  >
    <v-img
      :src="`/api/uploads/${upload.id}`"
      :alt="upload.name"
      aspect-ratio="1"
      class="bg-grey-lighten-2"
      cover
    >
      <div class="absolute bottom-0 left-0 right-0 flex flex-col justify-between p-2">
        <div class="flex justify-between">
          <v-chip
            color="primary"
            variant="flat"
            size="small"
          >
            <div class="flex items-center gap-2">
              <Icon :name="upload.commentsCount ? 'mdi:comment' : 'mdi:comment-outline'" />
              <span>{{ upload.commentsCount ?? 0 }}</span>
            </div>
          </v-chip>
          <v-chip
            size="small"
            variant="flat"
            color="gray"
          >
            <div class="flex items-center gap-2">
              <Icon
                :name="upload.reacted ? 'mdi:heart' : 'mdi:heart-outline'"
                color="red"
              />
              <span>{{ upload.reactionsCount ?? 0 }}</span>
            </div>
          </v-chip>
        </div>
      </div>
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
