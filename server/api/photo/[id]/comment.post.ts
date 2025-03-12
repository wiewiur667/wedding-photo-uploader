import { eq } from 'drizzle-orm'

import { ulid } from 'ulid'

import { db } from '~/db'
import { comment as commentTable, user as userTable } from '~/db/schema'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const sessionId = getHeader(event, 'Session-Id')
  const { comment } = await readBody(event)

  if (!id || !comment || !sessionId) {
    setResponseStatus(event, 400, 'id, comment, and Session-Id are required')
    return
  }

  const userId = (await db.select().from(userTable).where(eq(userTable.session_id, sessionId)))[0]?.id

  if (!userId) {
    setResponseStatus(event, 401, 'Unauthorized')
    return
  }

  try {
    await db.insert(commentTable).values({
      id: ulid(),
      fk_upload_id: id!,
      comment,
      created_at: Date.now(),
      fk_user_id: userId,
    })
    return true
  }
  catch (error) {
    console.error(error)
    setResponseStatus(event, 500)
  }
})
