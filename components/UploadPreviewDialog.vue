<script lang="ts" setup>
import type { CommentsView } from '#components'
import type ReactionsView from './ReactionsView.vue'
import type { IUpload } from '~/code/interfaces/Upload.interface'
import { defaultDateFormat } from '~/code/utils'

const { upload } = defineProps<Props>()
defineEmits(['close', 'next', 'prev', 'react'])

interface Props {
  upload: IUpload
}

const { isAdmin } = storeToRefs(useUserStore())

async function download() {
  const u = await $api(`/api/uploads/${upload.id}`, {
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

function openReactions() {
  reactionsRef?.value?.open()
}

const commentsRef = ref<typeof CommentsView>()

function openComments() {
  commentsRef?.value?.open()
}

const dialog = ref(false)

function closeDialog() {
  dialog.value = false
}

function acceptForGallery() {
  // Add your logic to accept the upload for gallery display here
  closeDialog()
}
</script>

<template>
  <div class="grid grid-flow-row grid-rows-[min-content_1fr_min-content] bg-white/90 h-dvh">
    <div class="mb-3 flex items-center justify-between gap-3 p-2">
      <div class="flex flex-col text-black">
        <span class="truncate">{{ upload.name }}</span>
        <span class="text-xs">{{ upload.createdAt.toFormat(defaultDateFormat) }} {{ upload.byName }}</span>
      </div>
      <v-btn
        color="error"
        flat
        icon
        density="compact"
        variant="flat"
        @click="$emit('close', upload.id)"
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
      <div class="flex items-center justify-end gap-3 px-3 text-xs text-slate-300">
        <v-btn
          size="x-small"
          variant="text"
          prepend-icon="mdi-comment-outline"
          :text="$t('komentarz', upload.commentsCount ?? 1)"
          @click="() => openComments()"
        />
        <v-btn
          size="x-small"
          variant="text"
          :prepend-icon="upload.reacted ? 'mdi-heart' : 'mdi-heart-outline'"
          :text="`${upload.reactionsCount} ${$t('reactions.likes', upload.reactionsCount ?? 1)}`"
          class="flex items-center gap-2"
          @click="() => openReactions()"
        />
      </div>
      <div
        class="flex items-center justify-between gap-3 overflow-auto bg-black p-6 text-white"
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
        <!-- Delete -->
        <v-dialog v-if="isAdmin">
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
        </v-dialog>
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
      </div>
    </div>
  </div>
</template>
