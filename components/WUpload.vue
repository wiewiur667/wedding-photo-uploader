<script lang="ts" setup>
import { useFileDialog } from '@vueuse/core'
import ExifReader from 'exifreader'

const dialogVisibleModel = ref(false)
const { userName, sessionId } = storeToRefs(useAppStore())

const { open, onChange, onCancel } = useFileDialog({
  accept: 'image/jpeg,image/heic,image/heif,video/*', // Set to accept only image files
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
      exif: {},
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
  resolvedFiles.value.forEach((file, index) => {
    const f = file.fileData

    formData.append(`${index}-file`, f)
    formData.append(`${index}-meta`, JSON.stringify({
      comment: file.comment,
      size: f.size,
      type: f.type,
      lastModified: f.lastModified,
      creatorName: userName.value,
      creatorSessionId: sessionId.value,
    }))
  })
  try {
    uploading.value = true
    await $fetch('/api/upload', {
      method: 'POST',
      body: formData,
    })

    resultSnackbarVisible.value = true
    dialogVisibleModel.value = false
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
  <v-dialog
    v-model="dialogVisibleModel"
    scrollable
    persistent
    fullscreen
  >
    <template #activator>
      <v-fab
        app
        text="Wgraj"
        icon="mdi:camera"
        color="primary"
        variant="flat"
        @click="() => {
          open()
        }"
      />
      <v-snackbar
        v-model="resultSnackbarVisible"
        color="success"
        timeout="2000"
        rounded
        text="Pomyslnie wgrano zdjecia"
      >
        <template #actions>
          <v-btn
            variant="text"
            @click="resultSnackbarVisible = false"
          >
            Zamknij
          </v-btn>
        </template>
      </v-snackbar>
    </template>
    <template #default="{ isActive }">
      <v-card
        class="flex flex-1 flex-col gap-5 bg-white p-3"
      >
        <v-card-title class="items-center gap-3 flex!">
          <span>Wybierz zdjecia</span>
          <v-spacer />
          <v-btn
            variant="tonal"
            color="secondary"
            size="x-small"
            icon="mdi:close"
            @click="isActive.value = false"
          />
        </v-card-title>
        <v-card-text>
          <div
            v-if="!!resolvedFiles.length"
            class="flex flex-col gap-5"
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
                  <span v-else>Brak miniatury</span>
                </v-sheet>
              </v-carousel-item>
            </v-carousel>
            <div class="flex flex items-center gap-3">
              <v-btn
                variant="flat"
                color="primary"
                class="flex-1"
                @click.stop="() => removeFile(index)"
              >
                <div class="flex items-center justify-center gap-3">
                  Usun zdjecie
                  <Icon
                    name="mdi:close"
                    class="text-white"
                  />
                </div>
              </v-btn>
              <span>{{ carouselModel + 1 }} / {{ resolvedFiles.length }}</span>
            </div>
            <div>
              <v-text-field
                v-model="resolvedFiles[carouselModel].name"
                label="Nazwa pliku"
                variant="solo-filled"
                color="primary"
                flat
              />
              <v-textarea
                v-model="resolvedFiles[carouselModel].comment"
                label="Komentarz"
                variant="solo-filled"
                flat
              />
            </div>
          </div>
          <div
            v-else
            class="flex flex-1 flex-col items-center justify-center gap-5"
          >
            <v-btn
              color="primary"
              variant="flat"
              text="Wgraj zdjecia"
              prepend-icon="mdi:camera"
              @click="() => open()"
            />
          </div>
        </v-card-text>
        <v-card-actions>
          <v-btn
            color="primary"
            @click="() => {
              resolvedFiles = []
              open()
            }"
          >
            Od poczatku
          </v-btn>
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
  </v-dialog>
</template>
