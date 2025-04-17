import type { IUploadOffsetResponse } from '~/code/interfaces/responses/UploadsResponse.interface'
import type { IUpload } from '~/code/interfaces/Upload.interface'
import type { IUploadInfo } from '~/code/interfaces/UploadInfo.interface'
import { uniqBy } from 'lodash-es'
import { DateTime } from 'luxon'

export function useUploads() {
  const galleryItems = useState<IUpload[]>('galleryItems', () => ref<IUpload[]>([]))
  const galleryDataQuery = useOffsetData<IUploadOffsetResponse['rows'][number], IUpload>('uploads', `/api/uploads`, { transformRow: transformUploadData })
  const gallery = {
    ...galleryDataQuery,
    refresh: async () => {
      galleryItems.value = []
      galleryDataQuery.offset.value = 0
    },
  }

  watch(() => gallery.data, (newVal) => {
    if (newVal.value) {
      galleryItems.value = uniqBy([...galleryItems.value, ...(newVal.value.rows ?? [])], 'id')
    }
  }, {
    deep: true,
  })

  function transformUploadData(upload: IUploadOffsetResponse['rows'][number]): IUpload {
    return {
      ...upload,
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
    }
  }

  async function removeUpload(uploadId: string) {
    await $fetch(`api/uploads/${uploadId}`, {
      method: 'DELETE',
    })
  }

  async function react(uploadId: string) {
    const state = useState<IUpload[]>('galleryItems')
    const upload = state.value.find(upload => upload.id === uploadId)
    let reaction = 'like'
    if (upload?.reacted) {
      reaction = 'dislike'
    }

    const result = await $fetch<{ reacted: boolean, totalReactions: number }>(`api/uploads/${uploadId}/reaction?reaction=${reaction}`, {
      method: 'POST',
    })

    if (upload) {
      upload.reacted = result.reacted
      upload.reactionsCount = result.totalReactions
    }
  }

  function getUserAlbum(userId: string) {
    return useOffsetData<IUploadOffsetResponse['rows'][number], IUpload>(`album-${userId}`, `/api/uploads/`, {
      params: { userId },
      transformRow: transformUploadData,
    })
  }

  async function fetchInfo(id: string) {
    const upload = await $fetch<IUploadInfo>(`/api/uploads/${id}/info`)
    return upload
  }

  return {
    getUserAlbum,
    gallery,
    galleryItems,
    removeUpload,
    react,
    fetchInfo,
  }
}
