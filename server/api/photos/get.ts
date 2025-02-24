import { Readable, Stream } from 'node:stream'

export default defineEventHandler(async (event) => {
  const storage = useStorage('fs')
  const db = useDatabase()
  const query = getQuery(event)
  const id = Number.parseInt(query.id as string)
  const fileQuery = await db.sql`SELECT * FROM files WHERE id = ${id}`

  const fileData = fileQuery?.rows?.at(0)
  const location = fileData?.filelocation
  const file = await storage.getItem(`${location}`)

  console.log(file)
  const stream = Readable.from(file)

  setHeader(event, 'Content-Type', fileData?.mimetype as string)
  return file
})
