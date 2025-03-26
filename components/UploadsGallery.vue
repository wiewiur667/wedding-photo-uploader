<script lang="ts" setup>
import { uniqBy } from 'lodash-es'

const uploadsStore = useUploadsStore()
const { uploads, uploadsLoading } = storeToRefs(uploadsStore)

await uploadsStore.getUploads()

const { mdAndUp } = useDisplay()

const columns = computed(() => mdAndUp.value ? 8 : 2)

const previewDialogOpen = ref(false)
const previewDialogIndex = ref(0)

function previewUpload(index: number) {
  previewDialogIndex.value = index
  previewDialogOpen.value = true
}

function onDialogClose(id: string) {
  previewDialogOpen.value = false
  uploadsStore.updateInfo(id)
}

async function reactToUpload(id: string) {
  const upload = uploads.value.find(upload => upload.id === id)
  if (!upload)
    return

  const reaction = upload?.reacted ? 'dislike' : 'like'
  await $api(`/api/uploads/${id}/reaction?reaction=${reaction}`)

  await uploadsStore.updateInfo(id)
}

const uploadsList = computed(() => uniqBy(uploads.value, 'id'))
</script>

<template>
  <div>
    <div class="gallery-grid text-white!">
      <template
        v-for="(upload, index) in uploadsList"
        :key="upload.id"
      >
        <uploads-gallery-item
          class="shadow-dark-100 shadow-md"
          :upload="upload"
          @open="() => previewUpload(index)"
          @react="() => reactToUpload(upload.id)"
        />
      </template>
    </div>
    <v-dialog
      v-model="previewDialogOpen"

      fullscreen
    >
      <upload-preview-dialog

        v-touch="{
          down: () => previewDialogOpen = false,
        }"
        :index="previewDialogIndex"

        :upload="uploads.find(upload => upload.id === uploadsList[previewDialogIndex].id)!"
        class="touch-manipulation!"
        @close="(id) => onDialogClose(id)"
        @react="(id) => reactToUpload(id)"
      />
    </v-dialog>
    <v-overlay
      :model-value="uploadsLoading"
      class="align-center justify-center"
    >
      <v-progress-circular
        color="primary"
        size="64"
        indeterminate
      />
    </v-overlay>
  </div>
</template>

<style lang="scss">
.gallery-grid {
  display: grid;
  grid-template-columns: repeat(v-bind(columns), minmax(60px, 1fr));
  grid-gap: 0.75rem;
  margin: 0.75rem;
}
</style>
