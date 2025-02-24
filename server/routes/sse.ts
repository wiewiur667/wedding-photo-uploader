export default defineEventHandler(async (event) => {
  const eventStream = createEventStream(event)
  const storage = useStorage('fs')
  storage.watch(async (change, key) => {
    if (change === 'update') {
      await eventStream.push(JSON.stringify({
        type: 'update',
        key,
      }))
    }
    else if (change === 'remove') {
      await eventStream.push(JSON.stringify({
        type: 'remove',
        key,
      }))
    }
  })

  eventStream.onClosed(async () => {
    await eventStream.close()
  })

  return eventStream.send()
})
