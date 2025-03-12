<script lang="ts" setup>
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

const emit = defineEmits(['open', 'like'])

const vPress = {
  mounted: (el: HTMLElement) => {
    let pressTimer: NodeJS.Timeout
    let pressCounter = 0
    el.addEventListener('mousedown', () => {
      pressCounter++
      if (pressCounter === 1) {
        pressTimer = setTimeout(() => {
          emit('open')
          clearTimeout(pressTimer)
          pressCounter = 0
        }, 250)
      }
      if (pressCounter === 2) {
        pressCounter = 0
        emit('like')
        clearTimeout(pressTimer)
      }
    })
  },
}
</script>

<template>
  <div
    v-press
    class="square relative touch-manipulation overflow-hidden"
  >
    <img
      :src="`/api/photo/${upload.id}`"
      class="content h-full object-cover object-center"
      :alt="upload.name"
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
