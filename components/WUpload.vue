<script lang="ts" setup>
import { useFileDialog } from '@vueuse/core'
import ExifReader from 'exifreader'
import { DateTime } from 'luxon'
import { generateThumbnail } from '~/code/utils'

const dialogVisibleModel = ref(false)

const { open, onChange, onCancel } = useFileDialog({
  accept: 'image/jpeg,image/heic,image/heif,image/png', // Set to accept only image files
  reset: true,
})

interface ImageData {
  name: string
  size: number
  type: string
  lastModified: number
  src: MaybeRef<string>
  loading: Ref<boolean>
  exif: Ref<ExifReader.Tags>
  comment: string
  fileData: File
}

const resolvedFiles = ref<ImageData[]>([])

onChange((files) => {
  if (files?.length)
    dialogVisibleModel.value = true

  const filesArray = ref<File[]>([])
  filesArray.value = Array.from(files as FileList)

  resolvedFiles.value = filesArray.value.map<ImageData>((f) => {
    const result = reactive<Record<string, any>>({
      name: f.name,
      size: f.size,
      type: f.type,
      lastModified: f.lastModified,
      fileData: f,
      exif: ref({}),
    })

    result.src = URL.createObjectURL(f)

    result.exif = computedAsync(async () => {
      const exif = await ExifReader.load(f, {
        async: true,
      })
      delete exif.MakerNote
      return exif
    })

    result.loading = computed(() => {
      return !(result.src && result.exif)
    })

    return result
  })
})

onCancel(() => {
  resolvedFiles.value = []
})

const carouselModel = ref(0)

function removeFile(index: number) {
  resolvedFiles.value.splice(index, 1)
}

const uploading = ref(false)
const resultSnackbarVisible = ref(false)

async function uploadFiles() {
  const formData = new FormData()
  await Promise.all(toValue(resolvedFiles).map(async (file, index) => {
    const f = file.fileData

    const createdDate = toValue(file.exif)['Date Created']?.value as string
    formData.append(`${index}-file`, f)
    formData.append(`${index}-meta`, JSON.stringify({
      name: file.name,
      comment: file.comment,
      size: f.size,
      type: f.type,
      created: createdDate ? DateTime.fromFormat(createdDate, 'yyyy-MM-dd hh:mm').toMillis() : f.lastModified,
    }))

    const thumbnail = await generateThumbnail(f, 400, 400)
    formData.append(`${index}-thumbnail`, thumbnail!)
  }))

  try {
    uploading.value = true
    await $fetch('/api/upload', {
      body: formData,
      method: 'POST',
    })

    resultSnackbarVisible.value = true
    dialogVisibleModel.value = false
    refreshNuxtData('uploads')
  }
  catch (e) {
    console.error(e)
  }
  finally {
    uploading.value = false
    resolvedFiles.value = []
  }
}
</script>

<template>
  <v-bottom-sheet
    v-model="dialogVisibleModel"
    scrollable
    persistent
    max-width="800px"
  >
    <template #activator>
      <v-fab
        app
        :text="$t('action.upload')"
        icon="mdi:camera"
        color="primary"
        variant="elevated"
        @click="() => {
          open()
        }"
      />
      <v-snackbar
        v-model="resultSnackbarVisible"
        color="success"
        timeout="2000"
        rounded
        :text="$t('action.result.successfullyUploaded')"
      >
        <template #actions>
          <v-btn
            variant="text"
            :text="$t('action.close')"
            @click="resultSnackbarVisible = false"
          />
        </template>
      </v-snackbar>
    </template>
    <template #default="{ isActive }">
      <v-card
        class="flex flex-1 flex-col bg-white p-3"
      >
        <v-card-title class="items-center gap-3 flex!">
          <span>{{ $t('choosePhotos') }}</span>
          <v-spacer />
          <v-btn
            variant="flat"
            color="error"
            density="compact"
            icon
            @click="isActive.value = false"
          >
            <Icon name="mdi:close" />
          </v-btn>
        </v-card-title>
        <v-card-text
          v-if="!!resolvedFiles.length"
          class="flex flex-col justify-end gap-5"
        >
          <v-carousel
            v-model="carouselModel"
            hide-delimiters
          >
            <v-carousel-item
              v-for="(file, index) in resolvedFiles"
              :key="index"
            >
              <v-sheet class="h-full w-full flex-col gap-3 flex!">
                <div
                  v-if="file.src"
                  class="min-h-0 flex-1"
                >
                  <img
                    v-if="file.type.startsWith('image')"
                    :src="file.src"
                    class="m-auto block h-full max-w-full object-contain"
                  >
                  <video
                    v-else
                    controls
                    webkit-playsinline
                    playsinline
                    class="m-auto block h-full max-w-full object-contain"
                  >
                    <source
                      :src="file.src"
                      type="video/mp4"
                    >
                  </video>
                </div>
                <span v-else>{{ $t('noThumbnail') }}</span>
              </v-sheet>
            </v-carousel-item>
          </v-carousel>
          <div class="flex items-center justify-center gap-3">
            <span class="">{{ carouselModel + 1 }} / {{ resolvedFiles.length }}</span>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-btn
            color="primary"
            density="comfortable"
            :text="$t('action.removePhoto')"
            append-icon="mdi-close"
            @click.stop="() => removeFile(carouselModel)"
          />
          <v-spacer />
          <v-btn
            v-if="!!resolvedFiles.length"
            color="primary"
            @click="() => uploadFiles()"
          >
            Wgraj
          </v-btn>
        </v-card-actions>
      </v-card>
    </template>
  </v-bottom-sheet>
</template>
