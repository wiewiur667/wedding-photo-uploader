import type { ITopPhoto } from '~/code/interfaces/TopPhoto.interface'
import { defineStore } from 'pinia'
import { useApi } from '~/composables/useApi'

export const usePhotosStore = defineStore('photos', () => {
  // const { eventSource } = useServerEvents()
  const topPhotos = ref<ITopPhoto[]>([])

  async function getTopPhotos(limit: number = 10, offset: number = 0) {
    try {
      const topPhotoData = await useApi<{
        id: number
        name: string
        mimetype: string
        commentsCount: number
        reactionsCount: number
        reacted: boolean
      }[]>(`api/photo/top?limit=${limit}&offset=${offset}`) ?? []

      return (topPhotoData ?? []).map((photo) => {
        return {
          id: photo.id,
          type: photo.mimetype,
          name: photo.name,
          commentsCount: photo.commentsCount,
          reactionsCount: photo.reactionsCount,
          reacted: photo.reacted,
        }
      })
    }
    catch (error) {
      console.error(error)
    }
  }

  return {
    topPhotos,
    getTopPhotos,
  }
})
