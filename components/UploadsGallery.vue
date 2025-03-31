<script lang="ts" setup>
import type { IUpload } from '~/code/interfaces/Upload.interface'
import { uniqBy } from 'lodash-es'

const uploadsStore = useUploadsStore()
const { uploads, uploadsLoading } = storeToRefs(uploadsStore)

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

async function reactToUpload(id: string) {
  const upload = uploads.value.find(upload => upload.id === id)
  if (!upload)
    return

  const reaction = upload?.reacted ? 'dislike' : 'like'
  await $fetch(`/api/uploads/${id}/reaction?reaction=${reaction}`, {
    method: 'POST',
  })

  await uploadsStore.updateInfo(id)
}

const groupedUploads = computed(() => {
  const uniqueItems = uniqBy(uploads.value, 'id')
  return uniqueItems
})
</script>

<template>
  <div class="mb-20 flex flex-1 flex-col gap-2 px-2 py-2">
    <v-row>
      <v-col
        v-for="(upload) in groupedUploads"
        :key="upload.id"
        class="p-1!"
        cols="4"
      >
        <uploads-gallery-item

          :upload="upload"
          @open="() => previewUpload(upload)"
          @react="() => reactToUpload(upload.id)"
        />
      </v-col>
    </v-row>
    <v-dialog
      v-model="previewDialog.open"
      fullscreen
    >
      <upload-preview-dialog
        v-if="previewDialog.selected"
        v-touch="{
          down: () => previewDialog.open = false,
        }"
        :upload="previewDialog.selected"
        class="touch-manipulation!"
        @close="(id) => onDialogClose(id)"
        @react="(id) => reactToUpload(id)"
        @remove="async (id) => {
          await uploadsStore.removeUpload(id)
          previewDialog.open = false
        }"
      />
    </v-dialog>

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
</template>
