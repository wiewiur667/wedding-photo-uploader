<script lang="ts" setup>
import type { InfiniteScrollSide, InfiniteScrollStatus } from 'vuetify/lib/components/VInfiniteScroll/VInfiniteScroll.js'
import type { IUpload } from '~/code/interfaces/Upload.interface'
import { UploadsGalleryItem } from '#components'
import { motion } from 'motion-v'

interface Props {
  items: IUpload[]
  loadMoreFn: () => Promise<{ total: number, isMore: boolean }>
  refreshFn: () => Promise<void>
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'updateInfo', id: string): void
  (e: 'loadMore'): void
  (e: 'reaction', id: string): void
}>()

const previewDialog = reactive<{ open: boolean, selected: IUpload | null }>({
  open: false,
  selected: null,
})

const _key = ref(0)

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
  _key.value++
  await nextTick()
  await props.refreshFn()
}

async function load(options: { side: InfiniteScrollSide, done: (state: InfiniteScrollStatus) => void }) {
  const result = await props.loadMoreFn()

  if (result.isMore) {
    options.done('ok')
  }
  else {
    options.done('empty')
  }
}

const MotionGalleryItem = motion.create(UploadsGalleryItem)

const { open: openUpload } = inject('upload', { open: () => {} }) as { open: () => void }
</script>

<template>
  <v-infinite-scroll
    :key="_key"
    @load="(options) => load(options)"
  >
    <div class="mb-20 flex flex-1 flex-col gap-2 px-4 py-1">
      <v-row>
        <v-col
          v-for="upload in items"
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
