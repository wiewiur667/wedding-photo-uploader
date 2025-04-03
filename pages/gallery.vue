<script setup lang="ts">
definePageMeta({
  layout: 'main',
  middleware: ['authenticated'],
})

const uploadsStore = useUploadsStore()
const { uploads } = storeToRefs(uploadsStore)
</script>

<template>
  <div class="flex flex-1 flex-col gap-3 bg-gray-50">
    <!-- Top photos -->
    <v-img
      :src="`/api/uploads/${uploads.at(0)?.id}`"
      width="100%"
      height="300"
      cover
    >
      <div class="absolute bottom-0 left-0 right-0 min-h-30 flex flex-col justify-end gap-3 from-gray-50 to-gray-50/0 bg-gradient-to-t" />
    </v-img>
    <div class="py-16 pt-2 text-center text-3xl tracking-tight">
      Galeria zdjec
    </div>
    <w-albums />
    <uploads-gallery />
  </div>
</template>
