<script lang="ts" setup>
import type { IUpload } from '~/code/interfaces/Upload.interface'
import { UploadsGalleryItem } from '#components'
import { uniqBy } from 'lodash-es'
import { motion } from 'motion-v'

const uploadsStore = useUploadsStore()
const { uploads, uploadsLoading, totalUploads } = storeToRefs(uploadsStore)

await uploadsStore.getUploads()

// const { mdAndUp } = useDisplay()

// const columns = computed(() => mdAndUp.value ? 8 : 2)

const previewDialog = reactive<{ open: boolean, selected: IUpload | null }>({
  open: false,
  selected: null,
})

function previewUpload(selected: IUpload) {
  previewDialog.selected = selected
  previewDialog.open = true
}

function onDialogClose(id: string) {
  previewDialog.open = false
  uploadsStore.updateInfo(id)
}

async function reactToUpload(upload: IUpload) {
  const reaction = upload?.reacted ? 'dislike' : 'like'
  await $fetch(`/api/uploads/${upload.id}/reaction?reaction=${reaction}`, {
    method: 'POST',
  })

  await uploadsStore.updateInfo(upload.id)
}

async function load(done: (state: string) => void) {
  if (totalUploads?.value != null && uploads.value.length < totalUploads.value)
    await uploadsStore.getUploads()
  done('ok')
}

const groupedUploads = computed(() => {
  const uniqueItems = uniqBy(uploads.value, 'id')
  return uniqueItems
})

const MotionGalleryItem = motion.create(UploadsGalleryItem)
</script>

<template>
  <v-infinite-scroll
    :items="groupedUploads"
    @load="load"
  >
    <div class="mb-20 flex flex-1 flex-col gap-2 px-4 py-1">
      <v-row>
        <v-col
          v-for="(upload) in groupedUploads"
          :key="upload.id"
          class="p-[0.125rem]!"
          cols="4"
          md="3"
          lg="2"
          xl="2"
        >
          <MotionGalleryItem
            :while-press="{ scale: 0.95 }"
            :transition="{ type: 'spring', duration: 0.2 }"
            :upload="upload"
            @open="() => previewUpload(upload)"
            @react="() => reactToUpload(upload)"
          />
        </v-col>
      </v-row>
      <upload-preview-dialog
        v-if="previewDialog.selected"
        v-model="previewDialog.open"
        v-touch="{
          down: () => previewDialog.open = false,
        }"
        :upload="previewDialog.selected"
        class="touch-manipulation!"
        @close="(id: string) => onDialogClose(id)"
        @react="(upload: IUpload) => reactToUpload(upload)"
        @remove="async (id: string) => {
          await uploadsStore.removeUpload(id)
          previewDialog.open = false
        }"
      />

      <v-overlay
        :model-value="uploadsLoading"
        class="items-center justify-center"
      >
        <v-progress-circular
          color="primary"
          size="64"
          indeterminate
        />
      </v-overlay>
    </div>
  </v-infinite-scroll>
</template>
