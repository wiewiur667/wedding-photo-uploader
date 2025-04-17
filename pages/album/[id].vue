<script lang="ts" setup>
import type { IUpload } from '~/code/interfaces/Upload.interface'

definePageMeta({
  layout: 'main',
  middleware: ['authenticated'],
})

const { id } = useRoute().params

const { getUserAlbum } = useUploads()
const { execute, refresh, offset, limit, total, data } = getUserAlbum(id as string)
const galleryItems = ref<IUpload[]>([])
async function loadMoreFn() {
  offset.value = galleryItems.value.length
  limit.value = 10
  galleryItems.value = [...galleryItems.value, ...(data.value?.rows ?? [])]
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
  <div class="flex flex-col gap-3 py-3">
    <v-btn
      class="flex-none"
      :to="{ name: 'gallery' }"
      variant="text"
      color="primary"
      :rounded="false"
    >
      Powrot
    </v-btn>
    Album Uzytkownika
    <uploads-gallery
      :items="galleryItems"
      :load-more-fn="loadMoreFn"
      :refresh-fn="refreshFn"
    />
  </div>
</template>

<style>

</style>
