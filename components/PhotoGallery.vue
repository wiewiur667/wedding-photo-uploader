<script lang="ts" setup>

const photoStore = usePhotosStore()
const { topPhotos } = storeToRefs(photoStore)

const {mdAndDown} = useDisplay()

await callOnce(async () => topPhotos.value = await photoStore.getTopPhotos(10, 0) ?? [])

const mappedPhotos = ref<any[]>([])
mappedPhotos.value = mapPhotos(topPhotos.value)

function mapPhotos(photos: any[]) {
  return photos.map(photo => ({
    type: photo.type,
    name: photo.name,
    id: photo.id,
    reactionsCount: photo.reactionsCount ?? 0,
    commentsCount: photo.commentsCount ?? 0,
    reacted: photo.reacted,
  }))
}

const columns = 3

async function loadMore({ done }: { side: any, done: (param: 'ok' | 'empty') => void }) {
  topPhotos.value = await photoStore.getTopPhotos(10, mappedPhotos.value.length) ?? []
  mappedPhotos.value = mapPhotos(topPhotos.value)
  done(topPhotos.value.length > mappedPhotos.value.length ? 'ok' : 'empty')
}

const previewDialogOpen = ref(false)
const previewDialogIndex = ref(0)

function previewUpload(index: number) {
  previewDialogIndex.value = index
  previewDialogOpen.value = true
}

async function likeUpload(upload: any) {
  const photo = mappedPhotos.value.find(photo => photo.id === upload.id)
  const reaction = photo.reacted ? 'dislike' : 'like'

  const { count, reacted } = await useApi(`/api/photo/${upload.id}/reaction?reaction=${reaction}`, {
    method: 'POST',
  })
  photo.reactionsCount = count
  photo.reacted = !!reacted
}
</script>

<template>
  <v-data-iterator
    :items="mappedPhotos"
    @load="loadMore"
  >
    <template #default="{ items: uploads }">
      <div class="gallery-grid text-white!">
        <template
          v-for="(upload, index) in uploads"
          :key="upload.raw.id"
        >
          <photo-gallery-item
            :upload="upload.raw"
            @open="() => previewUpload(index)"
            @like="() => likeUpload(upload.raw)"
          />
        </template>
      </div>
      <v-dialog
        v-model="previewDialogOpen"
        fullscreen
      >
        <photo-preview-dialog
          :index="previewDialogIndex"
          :uploads="uploads.map(upload => upload.raw)"
          @close="previewDialogOpen = false"
        />
      </v-dialog>
    </template>
  </v-data-iterator>
</template>

<style lang="scss">
.gallery-grid {
  display: grid;
  grid-template-columns: repeat(v-bind(columns), minmax(60px, 1fr));
  grid-gap: 0.5rem;
  margin: 0.5rem;
}
</style>
