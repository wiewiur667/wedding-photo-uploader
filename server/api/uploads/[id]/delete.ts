import { eq } from 'drizzle-orm'
import { db } from '~/db'
import { comment as commentTable, upload as uploadTable } from '~/db/schema'

export default defineEventHandler(async (event) => {
  const user = event.context.auth.user
  if (!user || !user.is_admin) {
    setResponseStatus(event, 401, 'Unauthorized')
    return
  }

  const uploadId = getRouterParam(event, 'id')
  const storage = useStorage('fs')

  if (!uploadId) {
    setResponseStatus(event, 400, 'Upload ID is required')
    return
  }

  const upload = (await db
    .select()
    .from(uploadTable)
    .where(eq(uploadTable.id, uploadId))).at(0)

  if (!upload) {
    setResponseStatus(event, 404, 'Upload not found')
    return
  }

  try {
    await db.delete(uploadTable).where(eq(uploadTable.id, uploadId)).run()
    await db.delete(commentTable).where(eq(commentTable.fk_upload_id, uploadId)).run()

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
