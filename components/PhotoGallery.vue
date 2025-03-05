<script lang="ts" setup>
import { useDisplay } from 'vuetify'

const { width } = useDisplay()

const photoStore = usePhotosStore()
const { topPhotos } = storeToRefs(photoStore)

await callOnce(async () => topPhotos.value = await photoStore.getTopPhotos(10, 0))

const mappedPhotos = ref<any[]>([])
mappedPhotos.value = mapPhotos(topPhotos.value)

function mapPhotos(photos: any[]) {
  return photos.map(photo => ({
    type: photo.type,
    name: photo.name,
    id: photo.id,
  }))
}

const minSquareSize = 150

const columns = computed(() => Math.floor(width.value / minSquareSize))

// Return rows with columns of uploads
function generateRows(items: any[] = mappedPhotos.value) {
  let index = 0
  return Array.from({ length: Math.ceil(items.length / columns.value) }, () => {
    return mappedPhotos.value.slice(index, index += columns.value)
  })
}

async function loadMore({ side, done }) {
  topPhotos.value = await photoStore.getTopPhotos(10, mappedPhotos.value.length)
  mappedPhotos.value = mapPhotos(topPhotos.value)
  done('ok')
}

const rows = computed(() => {
  return generateRows(mappedPhotos.value)
})

const previewModel = ref({
  visible: false,
  target: null,
})

function previewUpload(upload: any) {
  previewModel.value = {
    visible: true,
    target: upload,
  }
}
</script>

<template>
  <v-infinite-scroll
    height="full"
    mode="manual"
    @load="loadMore"
  >
    <template
      v-for="row in rows"
      :key="row"
    >
      <div class="gallery-grid">
        <photo-gallery-upload-item
          v-for="upload in row"
          :key="upload.url"
          :upload="upload"
          @open="previewUpload(upload)"
        />
      </div>
    </template>
  </v-infinite-scroll>
  {{ previewModel }}
  <v-dialog
    v-model="previewModel.visible"
  >
    <photo-preview-dialog
      :target="previewModel.target"
      fullscreen
    />
  </v-dialog>
</template>

<style lang="scss">
.gallery-grid {
  display: grid;
  grid-template-columns: repeat(v-bind(columns), minmax(150px, 1fr));
  grid-gap: 0.5rem;
  margin-top: 0.5rem;
}
</style>
