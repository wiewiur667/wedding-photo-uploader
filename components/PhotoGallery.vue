<script lang="ts" setup>
import {useDisplay} from 'vuetify'

const {mobile, width} = useDisplay()

const {getTopPhotos} = usePhotosStore()

const mappedUploads = ref<{url: string, type: string, name: string}[]>([])


onMounted(async ()=> {
  mappedUploads.value = (await getTopPhotos()).map((photo) => {
    return {
      url: URL.createObjectURL(photo.data),
      type: photo.type,
      name: photo.name
    }
  })
})

const minSquareSize = 150

const columns = computed(()=> Math.floor(width.value / minSquareSize))
// Return rows with columns of uploads
function generateRows(items: any[] = mappedUploads.value) {
  let index = 0
  return Array.from({ length: Math.ceil(items.length / columns.value) }, () => {
    return mappedUploads.value.slice(index, index += columns.value)
  })
}

async function loadMore({side, done}) {
  mappedUploads.value = (await getTopPhotos()).map((photo) => {
    return {
      url: URL.createObjectURL(photo.data),
      type: photo.type,
      name: photo.name
    }
  })

  done('ok')

    // setTimeout(() => {
    //   mappedUploads.value = [...[], ...mappedUploads.value]
    //   generateRows(mappedUploads.value)
    //   done('ok')
    // }, 1000)
  
}

const rows = computed(()=> {
  return generateRows(mappedUploads.value)
})

</script>

<template>
  <v-infinite-scroll height="full" @load="loadMore" mode="manual">
    <template v-for="row in rows">
        <div class="gallery-grid">
          <photo-gallery-upload-container v-for="upload in row" :key="upload.url" :upload="upload" />
        </div>
        </template>
  </v-infinite-scroll>
</template>

<style lang="scss">
.gallery-grid {
  display: grid;
  grid-template-columns: repeat(v-bind(columns), minmax(150px, 1fr));
  grid-gap: 0.5rem;
  margin-top: 0.5rem;
}
</style>
