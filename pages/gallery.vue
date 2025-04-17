<script setup lang="ts">
definePageMeta({
  layout: 'main',
  middleware: ['authenticated'],
})

const { gallery, galleryItems } = useUploads()

const { refresh, execute, offset, limit, total } = gallery

// const uploadsStore = useUploadsStore()
// const { uploads } = storeToRefs(uploadsStore)

await execute()

const topPhoto = computed(() => {
  const topPhotoId = galleryItems.value?.at(0)?.id
  if (topPhotoId != null)
    return `/api/uploads/${topPhotoId}`

  return null
})

async function loadMoreFn() {
  offset.value = galleryItems.value.length
  limit.value = 10
  await execute()

  return {
    total: galleryItems.value.length,
    isMore: galleryItems.value.length < (total?.value ?? 0),
  }
}

async function refreshFn() {
  await refresh()
}
</script>

<template>
  <div class="flex flex-1 flex-col gap-3 bg-gray-50">
    <!-- Top photos -->
    <div class="h-200px">
      <v-img
        v-if="topPhoto"
        :src="topPhoto"
        width="100%"
        :height="200"
        :max-height="200"
        cover
      />
    </div>
    <div class="text-primary py-8 text-center text-3xl tracking-tight">
      {{ $t('pages.gallery.title') }}
    </div>
    <w-albums />
    <uploads-gallery
      :items="galleryItems"
      :load-more-fn
      :refresh-fn
    />
  </div>
</template>
