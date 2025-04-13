<script lang="ts" setup>
import type { VInfiniteScroll } from 'vuetify/components'
import type { IUpload } from '~/code/interfaces/Upload.interface'
import { UploadsGalleryItem } from '#components'
import { uniqBy } from 'lodash-es'
import { motion } from 'motion-v'

interface Props {
  dataFn: ReturnType<ReturnType<typeof useUploads>['getGallery']> | ReturnType<ReturnType<typeof useUploads>['getAlbum']>
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'updateInfo', id: string): void
  (e: 'loadMore'): void
  (e: 'reaction', id: string): void
}>()

const { data: _uploads, execute: getUploads, total: totalUploads, offset, limit, refresh: refreshUploads } = props.dataFn

const uploads = ref<IUpload[]>([])
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
  emit('updateInfo', id)
}

async function reactToUpload(upload: IUpload) {
  const reaction = upload?.reacted ? 'dislike' : 'like'
  emit('reaction', reaction)
}

async function refresh() {
  uploads.value = []
  offset.value = 0
  await refreshUploads()
  uploads.value = [...uploads.value, ..._uploads.value?.rows ?? []]
}

async function load(options: { side: string, done: (state: string) => void }) {
  if (totalUploads.value == null || uploads.value.length < totalUploads.value) {
    offset.value = _uploads.value?.rows.length ?? 0
    await getUploads()
    uploads.value = [...uploads.value, ..._uploads.value?.rows ?? []]

    options.done('ok')
  }

  if (totalUploads.value != null && totalUploads.value === 0) {
    options.done('empty')
    return
  }

  if (totalUploads.value === uploads.value.length) {
    options.done('empty')
  }
}

const groupedUploads = computed<IUpload[]>(() => {
  const uniqueItems = uniqBy(uploads.value, 'id')
  return uniqueItems
})

const MotionGalleryItem = motion.create(UploadsGalleryItem)

const { open: openUpload } = inject('upload', { open: () => {} }) as { open: () => void }

uploads.value = [...uploads.value, ..._uploads.value?.rows ?? []]
</script>

<template>
  <v-infinite-scroll
    @load="load"
  >
    <div class="mb-20 flex flex-1 flex-col gap-2 px-4 py-1">
      <v-row>
        <v-col
          v-for="upload in groupedUploads"
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
      />
    </div>
    <template #empty>
      <div class="flex flex-1 flex-col items-center justify-center gap-2 p-4 text-gray-500">
        <span class="text-lg font-thin">{{ $t('pages.gallery.empty') }}</span>
        <v-btn
          variant="tonal"
          color="pimary"
          class="text-primary!"
          :text="$t('action.upload')"
          @click="openUpload()"
        />
        <span>lub</span>
        <v-btn
          variant="tonal"
          color="secondary"
          class="text-primary!"
          :text="$t('action.refresh')"
          @click="refresh()"
        />
      </div>
    </template>
  </v-infinite-scroll>
</template>
