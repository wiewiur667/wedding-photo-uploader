<script setup lang="ts">
definePageMeta({
  layout: 'main',
  middleware: ['authenticated'],
})

const uploadsStore = useUploadsStore()
const { uploads } = storeToRefs(uploadsStore)
</script>

<template>
  <div class="flex flex-1 flex-col gap-3 bg-gray-100">
    <!-- Top photos -->
    <v-img
      :src="`/api/uploads/${uploads.at(13)?.id}`"
      width="100%"
      height="300"
      cover
    >
      <div class="absolute bottom-0 left-0 right-0 h-30 min-h-10 flex flex-col justify-end gap-3 from-gray-100 via-gray-100 to-gray-100/0 bg-gradient-to-t" />
    </v-img>
    <div class="py-12 pt-1 text-center text-3xl">
      Galeria zdjec
    </div>
    <w-albums />
    <uploads-gallery />
  </div>
</template>
