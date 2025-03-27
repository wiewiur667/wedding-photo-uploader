<script lang="ts" setup>
import { uniqBy } from 'lodash-es'
import { DateTime } from 'luxon'

const uploadsStore = useUploadsStore()
const { uploads, uploadsLoading } = storeToRefs(uploadsStore)

await uploadsStore.getUploads()

const { mdAndUp } = useDisplay()

const columns = computed(() => mdAndUp.value ? 8 : 2)

const previewDialogOpen = ref(false)
const previewDialogIndex = ref(0)

function previewUpload(index: number) {
  previewDialogIndex.value = index
  previewDialogOpen.value = true
}

function onDialogClose(id: string) {
  previewDialogOpen.value = false
  uploadsStore.updateInfo(id)
}

async function reactToUpload(id: string) {
  const upload = uploads.value.find(upload => upload.id === id)
  if (!upload)
    return

  const reaction = upload?.reacted ? 'dislike' : 'like'
  await $api(`/api/uploads/${id}/reaction?reaction=${reaction}`)

  await uploadsStore.updateInfo(id)
}

const groupedUploads = computed(() => {
  const uniqueItems = uniqBy(uploads.value, 'id')
  const grouped = {}

  uniqueItems.forEach((upload) => {
    // Parse the createdAt date
    const dt = upload.createdAt
    const dateKey = dt.toFormat('yyyy-MM-dd') // Date as key
    const hourKey = dt.toFormat('HH') // Hour as key

    // Initialize date group if it doesn't exist
    if (!grouped[dateKey]) {
      grouped[dateKey] = {
        date: dt.toFormat('cccc, d LLLL yyyy'), // Formatted date for display
        hours: {},
      }
    }

    // Initialize hour group if it doesn't exist
    if (!grouped[dateKey].hours[hourKey]) {
      grouped[dateKey].hours[hourKey] = {
        hour: dt.toFormat('HH:00'), // Formatted hour for display
        items: [],
      }
    }

    // Add upload to its group
    grouped[dateKey].hours[hourKey].items.push(upload)
  })

  return grouped

  // Convert to array format for easier iteration in template
  // return Object.entries(grouped).map(([dateKey, dateGroup]) => {
  //   return {
  //     date: dateGroup.date,
  //     hours: Object.entries(dateGroup.hours).map(([hourKey, hourGroup]) => {
  //       return {
  //         hour: hourGroup.hour,
  //         items: hourGroup.items
  //       }
  //     }).sort((a, b) => b.hour.localeCompare(a.hour)) // Sort hours in descending order
  //   }
  // }).sort((a, b) => {
  //   // Extract date objects for comparison
  //   const dateA = DateTime.fromFormat(dateGroup.date, 'cccc, d LLLL yyyy')
  //   const dateB = DateTime.fromFormat(dateGroup.date, 'cccc, d LLLL yyyy')
  //   return dateB < dateA ? -1 : 1 // Sort dates in descending order
  // })
})
</script>

<template>
  <div class="columns-2 gap-4 md:columns-4 space-y-4">
    <template
      v-for="(upload, index) in uploadsList"
      :key="upload.id"
    >
      <uploads-gallery-item
        class="grid-item rounded-lg"
        :upload="upload"
        @open="() => previewUpload(index)"
        @react="() => reactToUpload(upload.id)"
      />
    </template>

    <v-dialog
      v-model="previewDialogOpen"

      fullscreen
    >
      <upload-preview-dialog

        v-touch="{
          down: () => previewDialogOpen = false,
        }"
        :index="previewDialogIndex"

        :upload="uploads.find(upload => upload.id === uploadsList[previewDialogIndex].id)!"
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

<style lang="scss">
.gallery-grid {
  display: masonry;
  masonry-template-tracks: repeat(auto-fill, minmax(14rem, 1fr));
  gap: 1rem;
}
</style>
