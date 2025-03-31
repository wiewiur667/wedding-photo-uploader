import { eq } from 'drizzle-orm'
import { db } from '~/db'
import { comment as commentTable, reaction as reactionTable, upload as uploadTable, user as userTable } from '~/db/schema'

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event)

  const uploadId = getRouterParam(event, 'id')
  const storage = useStorage('fs')

  if (!uploadId) {
    setResponseStatus(event, 400, 'Upload ID is required')
    return
  }

  const dbUser = await db.query.user.findFirst({
    where: eq(userTable.id, user.id),
  })

  const upload = (await db
    .select()
    .from(uploadTable)
    .where(eq(uploadTable.id, uploadId))).at(0)

  if (!dbUser?.is_admin && dbUser?.id !== upload?.fk_user_id) {
    setResponseStatus(event, 403, 'You are not authorized to delete this upload')
    return
  }

  if (!upload) {
    setResponseStatus(event, 404, 'Upload not found')
    return
  }

  try {
    await db.delete(uploadTable).where(eq(uploadTable.id, uploadId)).run()
    await db.delete(commentTable).where(eq(commentTable.fk_upload_id, uploadId)).run()
    await db.delete(reactionTable).where(eq(reactionTable.fk_upload_id, uploadId)).run()

    const fileURL = upload.location
    const thumbnailURL = upload.location.replace(':', ':thumbnail-')

    await storage.removeItem(fileURL)
    await storage.removeItem(thumbnailURL)

    setResponseStatus(event, 200)

    return {
      status: 'success',
    }
  }
  catch (e) {
    return { e }
  }
})
