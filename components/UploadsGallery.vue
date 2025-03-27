<script lang="ts" setup>
import type { DateTime } from 'luxon'
import type { IUpload } from '~/code/interfaces/Upload.interface'
import { uniqBy } from 'lodash-es'

const uploadsStore = useUploadsStore()
const { uploads, uploadsLoading } = storeToRefs(uploadsStore)

await uploadsStore.getUploads()

// const { mdAndUp } = useDisplay()

// const columns = computed(() => mdAndUp.value ? 8 : 2)

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
  uploadsStore.updateInfo(id)
}

async function reactToUpload(id: string) {
  const upload = uploads.value.find(upload => upload.id === id)
  if (!upload)
    return

  const reaction = upload?.reacted ? 'dislike' : 'like'
  await $fetch(`/api/uploads/${id}/reaction?reaction=${reaction}`, {
    method: 'POST',
  })

  await uploadsStore.updateInfo(id)
}

const groupedUploads = computed(() => {
  const uniqueItems = uniqBy(uploads.value, 'id')
  const grouped = {} as Record<string, {
    dateRaw: DateTime
    date: string
    hours: Record<string, {
      hourRaw: DateTime
      hour: string
      items: any[]
    }>
  }>

  uniqueItems.forEach((upload) => {
    // Parse the createdAt date
    const dt = upload.created
    const dateKey = dt.toFormat('yyyy-MM-dd') // Date as key
    const hourKey = dt.toFormat('HH') // Hour as key

    // Initialize date group if it doesn't exist
    if (!grouped[dateKey]) {
      grouped[dateKey] = {
        dateRaw: dt, // Raw date for sorting
        date: dt.toFormat('cccc, d LLLL yyyy'), // Formatted date for display
        hours: {},
      }
    }

    // Initialize hour group if it doesn't exist
    if (!grouped[dateKey].hours[hourKey]) {
      grouped[dateKey].hours[hourKey] = {
        hourRaw: dt, // Raw date for sorting
        hour: dt.toFormat('HH:00'), // Formatted hour for display
        items: [],
      }
    }

    // Add upload to its group
    grouped[dateKey].hours[hourKey].items.push(upload)
  })

  // Convert to array format for easier iteration in template
  return Object.entries(grouped).map(([_, dateGroup]) => {
    return {
      dateRaw: dateGroup.dateRaw,
      date: dateGroup.date,
      hours: Object.entries(dateGroup.hours).map(([_, hourGroup]) => {
        return {
          hourRaw: hourGroup.hourRaw, // Raw hour for sorting
          hour: hourGroup.hour,
          items: hourGroup.items,
        }
      }).sort((a, b) => b.hourRaw < a.hourRaw ? -1 : 1), // Sort hours in descending order
    }
  }).sort((a, b) => {
    // Extract date objects for comparison
    const dateA = a.dateRaw
    const dateB = b.dateRaw
    return dateB < dateA ? -1 : 1 // Sort dates in descending order
  })
})
</script>

<template>
  <div class="flex flex-1 flex-col gap-2 px-2 py-2">
    <div
      v-for="(date) in groupedUploads"
      :key="date.date"
      class="flex flex-1 flex-col gap-2"
    >
      <span>{{ date.date }}</span>
      <div
        v-for="hour in date.hours"
        :key="hour.hour"
        class="flex flex-1 flex-col gap-4"
      >
        <span>{{ hour.hour }}</span>
        <div class="columns-2 gap-1 md:columns-4 space-y-1">
          <uploads-gallery-item
            v-for="(upload) in hour.items"
            :key="upload.id"
            :upload="upload"
            @open="() => previewUpload(upload)"
            @react="() => reactToUpload(upload.id)"
          />
        </div>
      </div>
    </div>

    <v-dialog
      v-model="previewDialog.open"
      fullscreen
    >
      <upload-preview-dialog
        v-if="previewDialog.selected"
        v-touch="{
          down: () => previewDialog.open = false,
        }"
        :upload="previewDialog.selected"
        class="touch-manipulation!"
        @close="(id) => onDialogClose(id)"
        @react="(id) => reactToUpload(id)"
      />
    </v-dialog>

    <v-overlay
      :model-value="uploadsLoading"
      class="align-center justify-center"
    >
      <v-progress-circular
        color="primary"
        size="64"
        indeterminate
      />
    </v-overlay>
  </div>
</template>
