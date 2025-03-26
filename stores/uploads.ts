import type { IPagedResult } from '~/code/interfaces/PagedResult.interface'
import type { IUpload } from '~/code/interfaces/Upload.interface'
import type { IUploadInfo } from '~/code/interfaces/UploadInfo.interface'
import { uniqBy } from 'lodash-es'
import { DateTime } from 'luxon'
import { defineStore } from 'pinia'
import { useApi } from '~/composables/useApi'

export const useUploadsStore = defineStore('uploads', () => {
  const uploads = ref<IUpload[]>([])
  const totalUploads = ref<number>(0)

  const limit = ref(50)
  const offset = ref(0)

  const { execute: _getUploads, status, data: uploadsData } = useApi<IPagedResult<{
    id: string
    name: string
    mimetype: string
    commentsCount: number
    reactionsCount: number
    reacted: boolean
    userName: string
    timestamp: number
  }>>(`api/uploads`, {
    params: {
      limit: limit.value,
      offset: offset.value,
    },
    immediate: false,
    key: 'uploads',
  })

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
        createdAt: DateTime.fromMillis(upload.createdAt),
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
    await _getUploads()
  }

  async function updateInfo(id: string) {
    const u = uploads.value.find(p => p.id === id)
    if (!u)
      return

    const upload = await $api<IUploadInfo>(`api/uploads/${id}/info`)

    if (status.value === 'success') {
      const result = toValue(upload)
      u.commentsCount = result?.commentsCount ?? 0
      u.reactionsCount = result?.reactionsCount ?? 0
      u.reacted = result?.reacted ?? false
    }
  }

  const uploadsLoading = computed(() => status.value === 'pending')

  return {
    uploadsLoading,
    getUploads,
    uploads,
    updateInfo,
  }
})
