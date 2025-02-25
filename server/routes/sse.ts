import { debounce } from 'lodash-es'

export default defineEventHandler(async (event) => {
  const eventStream = createEventStream(event)
  const storage = useStorage('fs')

  const handlePhotoUpdate = debounce(async () => await eventStream.push(JSON.stringify({
    event: 'photos:update',
  })), 1000)

  storage.watch(async () => {
    // if photos are added or removed, update the top photos
    handlePhotoUpdate()
  })

  eventStream.onClosed(async () => {
    await eventStream.close()
  })

  return eventStream.send()
})
