import { eq } from 'drizzle-orm'
import { db } from '~/db'
import { uploads } from '~/db/schema'

export default defineEventHandler(async (event) => {
  const storage = useStorage('fs')
  const id = getRouterParam(event, 'id')
  const fileQuery = await db.select().from(uploads).where(eq(uploads.id, Number(id)))

  const fileData = fileQuery?.at(0)

  if (fileData) {
    const location = fileData?.location
    const file = await storage.getItemRaw(`${location}`)

    event.node.res.setHeader('Content-Length', fileData.size)
    event.node.res.setHeader('Content-Type', fileData.mime_type)
    event.node.res.write(file)

    return
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
