import type { IUploadOffsetResponse } from '~/code/interfaces/responses/UploadsResponse.interface'
import type { IUpload } from '~/code/interfaces/Upload.interface'
import type { IUploadInfo } from '~/code/interfaces/UploadInfo.interface'
import { uniqBy } from 'lodash-es'
import { DateTime } from 'luxon'

export function useUploads() {
  const galleryItems = useState('galleryItems', () => ref<IUpload[]>([]))
  const gallery = useOffsetData<IUploadOffsetResponse['rows'][number], IUpload>('uploads', `/api/uploads`, { transformRow: transformUploadData })

  watch(() => gallery.data, (newVal) => {
    if (newVal.value) {
      galleryItems.value = uniqBy([...galleryItems.value, ...(newVal.value.rows ?? [])], 'id')
    }
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

  async function react(uploadId: string, reaction: string) {
    return await $fetch<number>(`api/uploads/${uploadId}/reaction?reaction=${reaction}`, {
      method: 'POST',
    })
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
