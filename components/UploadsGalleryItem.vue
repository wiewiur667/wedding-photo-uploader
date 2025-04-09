<script lang="ts" setup>
import type { IUpload } from '~/code/interfaces/Upload.interface'
import { Icon } from '#components'
import { motion, useAnimate } from 'motion-v'
import { vPress } from '~/code/utils'

interface Props {
  upload: IUpload
}
defineProps<Props>()

defineEmits<{
  open: []
  react: [upload: IUpload]
}>()

const [reactScope, animate] = useAnimate()
const MotionIcon = motion.create(Icon)

function animateIcon() {
  animate(reactScope.value, {
    scale: [1, 2, 1],
  }, {
    duration: 0.2,
  })
}
</script>

<template>
  <v-card
    v-press="{
      click: () => $emit('open'),
      dblclick: () => {
        $emit('react', upload)
        animateIcon()
      },
    }"
    flat
    :rounded="false"
    class="relative touch-manipulation gap-1 overflow-hidden bg-transparent"
  >
    <v-img
      :src="`/api/uploads/${upload.id}`"
      :alt="upload.name"
      :aspect-ratio="1"
      lazy-src="https://picsum.photos/id/11/100/60"
      cover
      class="pointer-events-none"
    >
      <div
        class="h-full flex items-end gap-2 text-white p-2!"
      >
        <div class="flex items-center gap-2 text-sm">
          <Icon :name="upload.commentsCount ? 'mdi:comment' : 'mdi:comment-outline'" />
          <span>{{ upload.commentsCount ?? 0 }}</span>
        </div>
        <div class="flex items-center gap-2 text-sm">
          <MotionIcon
            ref="reactScope"
            :name="upload.reacted ? 'mdi:heart' : 'mdi:heart-outline'"
            color="red"
          />
          <span>{{ upload.reactionsCount ?? 0 }}</span>
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
