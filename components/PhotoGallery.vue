<script lang="ts" setup>
const photosStore = usePhotosStore()
const { topPhotos, topPhotosData } = storeToRefs(photosStore)

const mappedPhotos = computed(() => {
  return topPhotosData.value.map((photo) => {
    return {
      url: URL.createObjectURL(photo),
    }
  })
})

const carouselModel = ref(1)
</script>

<template>
  <div>
    <v-carousel v-model:model-value="carouselModel">
      <v-carousel-item
        v-for="photo in mappedPhotos"
        :key="photo.url"
      >
        <v-img
          :src="photo.url"
          aspect-ratio="1"
          class="rounded-lg"
        />
      </v-carousel-item>
    </v-carousel>
  </div>
</template>

<style>

</style>
