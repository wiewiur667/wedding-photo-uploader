<template>
  <div class="square overflow-hidden relative">
    <img
      :src="upload.url"
      class="content object-cover object-center h-full"
      :alt="upload.name"
    >
    <div class="absolute bottom-0 left-0 right-0 flex flex-col justify-between p-2 px-4 bg-white/30">
      <div class="flex justify-between">
        <div class="flex items-center gap-2">
          <Icon name="mdi:comment" />
          <span>{{ commentsAmount }}</span>
        </div>
        <div class="flex items-center gap-2">
          <Icon name="mdi:heart" color="red" />
          <span>{{ likesAmount }}</span>
        </div>
      </div>
      </div>
</div>
</template>

<script lang="ts" setup>
interface Props {
  upload: {
    url: string
    type: string
    name: string
  }
  commentsAmount?: number
  likesAmount?: number
}
withDefaults(defineProps<Props>(), {
  commentsAmount: 0,
  likesAmount: 0,
})

</script>

<style lang="scss">

.square {
  position: relative;
  box-sizing: border-box;
  @apply rounded-sm
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
