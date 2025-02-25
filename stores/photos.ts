import type { ITopPhoto } from '~/code/interfaces/TopPhoto.interface'
import { defineStore } from 'pinia'

export const usePhotosStore = defineStore('photos', () => {
  const { eventSource } = useServerEvents()
  const topPhotos = ref<ITopPhoto[]>([])

  const topPhotosData = computedAsync<Blob[]>(async () => {
    const result = []
    for await (const photo of topPhotos.value) {
      const response = await $fetch(`api/photos/${photo.id}`)
      result.push(response)
    }

    return result
  }, [])

  const getTopPhotoIds = async () => {
    const response = await $fetch<ITopPhoto[]>('api/photos/top', {
      query: {
        limit: 10,
      },
    })

    topPhotos.value = response
  }

  getTopPhotoIds()

  eventSource.onmessage = async (sse) => {
    const event = JSON.parse(sse.data)
    if (event.event === 'photos:update') {
      await getTopPhotoIds()
    }
  }

  return {
    topPhotos,
    topPhotosData,
  }
})
