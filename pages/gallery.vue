<script setup lang="ts">
definePageMeta({
  layout: 'main',
  middleware: ['authenticated'],
})

const { gallery } = useUploads()

// const uploadsStore = useUploadsStore()
// const { uploads } = storeToRefs(uploadsStore)

const dataFn = gallery
await dataFn.execute()

const topPhoto = computed(() => {
  const topPhotoId = dataFn.data?.value?.rows.at(0)?.id
  if (topPhotoId != null)
    return `/api/uploads/${topPhotoId}`

  return null
})
</script>

<template>
  <div class="flex flex-1 flex-col gap-3 bg-gray-50">
    <!-- Top photos -->
    <v-img
      v-if="topPhoto"
      :src="topPhoto"
      width="100%"
      :height="200"
      :max-height="200"
      cover
    />
    <div class="text-primary py-8 text-center text-3xl tracking-tight">
      {{ $t('pages.gallery.title') }}
    </div>
    <w-albums />
    <uploads-gallery :data-fn="dataFn" />
  </div>
</template>
