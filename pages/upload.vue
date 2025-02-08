<script lang="ts" setup>
import { useFileDialog } from '@vueuse/core'
import { ref as storageRef } from 'firebase/storage'
import { useFirebaseStorage } from 'vuefire'

definePageMeta({
  layout: 'default',
})

const storage = useFirebaseStorage()
const mountainFileRef = storageRef(storage)

// const {
//   url,
//   // gives you a percentage between 0 and 1 of the upload progress
//   uploadProgress,
//   uploadError,
//   // firebase upload task
//   uploadTask,
//   upload,
// } = useStorageFile(mountainFileRef)

// function uploadPicture() {
//   const data = files.value?.item(0)
//   if (data) {
//     upload(data)
//   }
// }

const filename = ref<string>()
const { files, open, reset } = useFileDialog()
</script>

<template>
  <div>
    Upload
  </div>
</template>

<style>

</style>
