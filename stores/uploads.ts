import type { IUpload } from '~/code/interfaces/Upload.interface'
import type { IUploadInfo } from '~/code/interfaces/UploadInfo.interface'
import { uniqBy } from 'lodash-es'
import { DateTime } from 'luxon'
import { defineStore } from 'pinia'

export const useUploadsStore = defineStore('uploads', () => {
  const uploads = ref<IUpload[]>([])
  const totalUploads = ref<number>(0)

  const limit = ref(10)
  const offset = ref(0)

  const { execute: _getUploads, status, data: uploadsData, refresh } = getPagedData<{
    id: string
    name: string
    mimetype: string
    commentsCount: number
    reactionsCount: number
    reacted: boolean
    userName: string
    timestamp: number
  }>('uploads', `api/uploads`, offset, limit)

  watch(uploadsData, (uploadDataValue) => {
    if (!uploadDataValue)
      return

    uploads.value = uniqBy<IUpload>([
      ...(uploads.value ?? []),
      ...uploadDataValue.rows?.map((upload: any) => ({
        id: upload.id,
        type: upload.mimeType,
        name: upload.name,
        commentsCount: upload.commentsCount,
        reactionsCount: upload.reactionsCount,
        reacted: upload.reacted,
        byName: upload.userName,
        isOwner: upload.isOwner,
        created: DateTime.fromMillis(upload.created),
        approvedForGallery: upload.approvedForGallery,
      })) ?? [],
    ], 'id') ?? []

    totalUploads.value = uploadDataValue.total
    offset.value = uploads.value.length
  }, { deep: true })

  async function getUploads(o = offset.value ?? 0, l = limit.value ?? 10) {
    if (o !== offset.value || l !== limit.value) {
      limit.value = l
      offset.value = o
    }
    _getUploads()
  }

  async function updateInfo(id: string) {
    const u = uploads.value.find(p => p.id === id)
    if (!u)
      return

    const upload = await $fetch<IUploadInfo>(`api/uploads/${id}/info`)

    if (status.value === 'success') {
      const result = toValue(upload)
      u.commentsCount = result?.commentsCount ?? 0
      u.reactionsCount = result?.reactionsCount ?? 0
      u.reacted = result?.reacted ?? false
    }
  }

  async function removeUpload(id: string) {
    const upload = uploads.value.find(p => p.id === id)
    if (!upload)
      return

    await $fetch(`api/uploads/${id}`, { method: 'DELETE' })

    if (status.value === 'success') {
      uploads.value = uploads.value.filter(p => p.id !== id)
      totalUploads.value -= 1
    }
  }

  const uploadsLoading = computed(() => status.value === 'pending')

  return {
    uploadsLoading,
    getUploads,
    totalUploads,
    removeUpload,
    uploads,
    updateInfo,
    refresh,
  }
})
