<script lang="ts" setup>
import type { CommentsView } from '#components'
import type ReactionsView from './ReactionsView.vue'
import type { IUpload } from '~/code/interfaces/Upload.interface'

import { defaultDateFormat } from '~/code/utils'

const { upload } = defineProps<Props>()
const emit = defineEmits<{
  (e: 'close', id: string): void
  (e: 'next', id: string): void
  (e: 'prev', id: string): void
  (e: 'react', id: string): void
  (e: 'remove', id: string): void
}>()

interface Props {
  upload: IUpload
}

const { isAdmin } = storeToRefs(useUserStore())
const { removeUpload } = useUploadsStore()

async function download() {
  const u = await $fetch(`/api/uploads/${upload.id}`, {
    method: 'GET',
  })

  const url = URL.createObjectURL(u)

  const element = document.createElement('a')
  element.setAttribute('href', url)
  element.setAttribute('download', upload.name)
  document.body.appendChild(element)
  element.click()
  document.body.removeChild(element)
}

const reactionsRef = ref<typeof ReactionsView>()

// function openReactions() {
//   reactionsRef?.value?.open()
// }

const commentsRef = ref<typeof CommentsView>()

// function openComments() {
//   commentsRef?.value?.open()
// }

function closeDialog() {
  emit('close', upload.id)
}

function acceptForGallery() {
  // Add your logic to accept the upload for gallery display here
  closeDialog()
}

const removing = ref(false)
async function remove() {
  removing.value = true
  try {
    await removeUpload(upload.id)
    closeDialog()
  }
  catch (error) {
    console.error('Error removing upload:', error)
  }
  finally {
    removing.value = false
  }
}
</script>

<template>
  <div class="grid grid-flow-row grid-rows-[min-content_1fr_min-content] bg-white/90 h-dvh">
    <div class="mb-3 flex items-center justify-end gap-3 p-3">
      <v-btn
        color="error"
        flat
        icon
        density="compact"
        variant="flat"
        @click="closeDialog"
      >
        <Icon name="mdi:close" />
      </v-btn>
    </div>
    <div class="flex items-center justify-center p-3 min-h-0!">
      <img
        :src="`/api/uploads/${upload.id}`"
        class="overflow-hidden object-contain object-center max-h-full! max-w-full! min-h-0! rounded-xl!"
        :alt="upload.name"
      >
    </div>
    <div class="mt-3 flex flex-col">
      <div class="flex items-center justify-end gap-3 p-3 text-xs text-slate-900">
        <span class="text-xs">{{ upload.created.toFormat(defaultDateFormat) }} {{ upload.byName }}</span>
      </div>
      <div
        class="flex items-center justify-between gap-3 overflow-auto bg-gray-800 p-4 text-white"
      >
        <reactions-view
          ref="reactionsRef"
          :target-id="upload.id"
          :reacted="upload.reacted"
          @react="$emit('react', upload.id)"
        />
        <comments-view
          ref="commentsRef"
          :target-id="upload.id"
        />
        <v-btn
          flat
          size="small"
          variant="text"
          :text="$t('action.download')"
          prepend-icon="mdi-download-outline"
          @click="download"
        />

        <!-- Accept for gallery -->
        <v-dialog v-if="isAdmin">
          <template #activator="{ props }">
            <v-btn
              v-bind="props"
              flat
              size="small"
              variant="text"
              :text="$t('action.acceptForGallery')"
              prepend-icon="mdi-check"
            />
          </template>
          <v-card>
            <v-card-title>{{ $t('acceptForGallery.title') }}</v-card-title>
            <v-card-text>{{ $t('acceptForGallery.confirmation') }}</v-card-text>
            <v-card-actions>
              <v-btn
                color="primary"
                @click="acceptForGallery"
              >
                {{ $t('action.confirm') }}
              </v-btn>
              <v-btn @click="closeDialog">
                {{ $t('action.cancel') }}
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <!-- Delete -->
        <v-dialog v-if="upload.isOwner || isAdmin">
          <template #activator="{ props }">
            <v-btn
              v-bind="props"
              flat
              size="small"
              variant="text"
              :text="$t('action.delete')"
              prepend-icon="mdi-bin-outline"
            />
          </template>
          <v-card>
            <v-card-title>{{ $t('delete.title') }}</v-card-title>
            <v-card-text>{{ $t('delete.confirmation') }}</v-card-text>
            <v-card-actions>
              <v-btn
                color="primary"
                :loading="removing"
                @click="remove()"
              >
                {{ $t('action.confirm') }}
              </v-btn>
              <v-btn @click="closeDialog">
                {{ $t('action.cancel') }}
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </div>
    </div>
  </div>
</template>
