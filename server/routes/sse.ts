export default defineEventHandler(async (event) => {
  const eventStream = createEventStream(event)
  const storage = useStorage('fs')
  const db = useDatabase()
  storage.watch(async (change, key) => {
    if (change === 'update') {
      const topPhotos = await db.sql`SELECT * FROM files ORDER BY created_at DESC LIMIT 10`
      // console.log(topPhotos)

      await eventStream.push(JSON.stringify({
        type: 'update',
        topPhotos,
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
