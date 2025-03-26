import { eq } from 'drizzle-orm'
import { db } from '~/db'
import { upload as uploadTable } from '~/db/schema'

export default defineEventHandler(async (event) => {
  const user = await getUserSession(event)
  if (!user || !user.user?.is_admin) {
    setResponseStatus(event, 401, 'Unauthorized')
    return
  }

  const uploadId = getRouterParam(event, 'id')
  const storage = useStorage('fs')

  if (!uploadId) {
    setResponseStatus(event, 400, 'Upload ID is required')
    return
  }

  const upload = (await db.select().from(uploadTable).where(eq(uploadTable.id, uploadId)))[0]

  if (!upload) {
    setResponseStatus(event, 404, 'Upload not found')
    return
  }

  try {
    await db.delete(uploadTable).where(eq(uploadTable.id, uploadId)).run()

    const fileURL = upload.location
    const thumbnailURL = upload.location.replace(':', ':thumbnail-')

    await storage.removeItem(fileURL)
    await storage.removeItem(thumbnailURL)

    setResponseStatus(event, 204)
  }
  catch (e) {
    setResponseStatus(event, 500, e.message)
  }
})
