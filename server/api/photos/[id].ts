import { eq } from 'drizzle-orm'
import { db } from '~/db'
import { uploads } from '~/db/schema'

export default defineEventHandler(async (event) => {
  const storage = useStorage('fs')
  const id = getRouterParam(event, 'id')
  const fileQuery = await db.select().from(uploads).where(eq(uploads.id, `${id}`))

  const fileData = fileQuery?.at(0)

  if (fileData) {
    const location = fileData?.location
    const file = await storage.getItemRaw(`${location}`)

    console.log('found image', location)

    setHeader(event, 'Content-Length', fileData.size)
    setHeader(event, 'Content-Type', fileData.mime_type)

    console.log('image sent')

    return file
  }

  return sendError(event, {
    name: 'FileNotFoundError',
    statusCode: 404,
    message: 'File not found',
    fatal: false,
  })
  // setHeader(event, 'Content-Type', fileData.mimetype)
  // send(event, file, 'image/jpeg')
  // return stream
})
