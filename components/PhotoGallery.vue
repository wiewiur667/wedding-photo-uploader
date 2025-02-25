<script lang="ts" setup>
const photosStore = usePhotosStore()
const { topPhotos, topPhotosData } = storeToRefs(photosStore)

const mappedUploads = computed(() => {
  return topPhotosData.value.map((photo) => {
    return {
      url: URL.createObjectURL(photo.data),
      type: photo.type,
    }
  })
})

const carouselModel = ref(0)
</script>

<template>
  <div>
    <v-carousel
      v-model:model-value="carouselModel"
      continuous
      cycle
      interval="5000"
    >
      <v-carousel-item
        v-for="upload in mappedUploads"
        :key="upload.url"
      >
        <img
          v-if="upload.type.startsWith('image')"
          :src="upload.url"
          class="m-auto block h-full max-w-full object-contain"
        >
        <video
          v-else
          controls
          webkit-playsinline
          playsinline
          muted
          autoplay
          loop
          class="m-auto block h-full max-w-full object-contain"
        >
          <source
            :src="upload.url"
            type="video/mp4"
          >
        </video>
      </v-carousel-item>
    </v-carousel>
  </div>
</template>

<style>

</style>
