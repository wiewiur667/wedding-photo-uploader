<script lang="ts" setup>
import { VWindow } from 'vuetify/components'

const photosStore = usePhotosStore()
const { _topPhotos, topPhotosData } = storeToRefs(photosStore)

const mappedUploads = computed(() => {
  return topPhotosData.value.map((photo) => {
    return {
      url: URL.createObjectURL(photo.data),
      type: photo.type,
    }
  })
})

const carouselModel = ref(0)

let interval: NodeJS.Timeout

const windowRef = ref<VWindow>()
onMounted(() => {
  interval = setInterval(() => {
    windowRef.value?.group.next()
  }, 5000)
})

onUnmounted(() => {
  clearInterval(interval)
})
</script>

<template>
  <VWindow
    ref="windowRef"
    v-model:model-value="carouselModel"
    class="h-full min-h-0 bg-green"
    height="unset"
    continuous
    show-arrows="hover"
    hide-delimiters
  >
    <v-window-item
      v-for="upload in mappedUploads"
      :key="upload.url"
      class="flex flex-1 bg-amber max-h-dvh"
    >
      <v-card
        class="flex-1 bg-black max-h-dvh flex! items-center! justify-center!"
      >
        <img
          v-if="upload.type.startsWith('image')"
          :src="upload.url"
          class="block min-h-0 flex-1 object-contain max-h-dvh"
        >
        <video
          v-else
          controls
          webkit-playsinline
          playsinline
          muted
          autoplay
          loop
          class="block min-h-0 flex-1 max-h-dvh"
        >
          <source
            :src="upload.url"
            type="video/mp4"
          >
        </video>
      </v-card>
    </v-window-item>
  </VWindow>
</template>

<style>

</style>
