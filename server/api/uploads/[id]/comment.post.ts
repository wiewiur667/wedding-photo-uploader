import { eq } from 'drizzle-orm'

import { ulid } from 'ulid'

import { db } from '~/db'
import { comment as commentTable, user as userTable } from '~/db/schema'

export default defineEventHandler(async (event) => {
  const uploadId = getRouterParam(event, 'id')
  const sessionId = getHeader(event, 'Session-Id')
  const { comment } = await readBody(event)

  if (!uploadId || !comment || !sessionId) {
    setResponseStatus(event, 400, 'id, comment, and Session-Id are required')
    return
  }

  const user = (await db.select().from(userTable).where(eq(userTable.session_id, sessionId)))[0]

  if (!user.id) {
    setResponseStatus(event, 401, 'Unauthorized')
    return
  }

  try {
    const id = ulid()
    await db.insert(commentTable).values({
      id,
      fk_upload_id: uploadId!,
      comment,
      created_at: Date.now(),
      fk_user_id: user.id,
    })

    const newComment = (await db.select().from(commentTable).where(eq(commentTable.id, id)))[0]

    return newComment
  }
  catch (error) {
    console.error(error)
    setResponseStatus(event, 500)
  }
})
