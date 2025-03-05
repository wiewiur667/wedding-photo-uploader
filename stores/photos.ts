import type { ITopPhoto } from '~/code/interfaces/TopPhoto.interface'
import { defineStore } from 'pinia'

export const usePhotosStore = defineStore('photos', () => {
  // const { eventSource } = useServerEvents()
  const topPhotos = ref<ITopPhoto[]>([])

  async function getTopPhotos(limit: number = 10, offset: number = 0) {
    const topPhotoData = await $fetch<{
      id: number
      name: string
      mimetype: string
    }[]>(`api/photos/top?limit=${limit}&offset=${offset}`)

    return topPhotoData.map((photo) => {
      return {
        id: photo.id,
        type: photo.mimetype,
        name: photo.name,
      }
    })
  }

  // eventSource.onmessage = async (sse) => {
  //   const event = JSON.parse(sse.data)
  //   if (event.event === 'photos:update') {
  //     await getTopPhotoIds()
  //   }
  // }

  return {
    topPhotos,
    getTopPhotos,
  }
})
