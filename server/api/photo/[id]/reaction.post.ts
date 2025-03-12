import { and, count, eq, exists } from 'drizzle-orm'
import { ulid } from 'ulid'

import { db } from '~/db'
import { reaction as reactionTable, user as userTable } from '~/db/schema'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const { reaction } = getQuery(event)
  const sessionId = getHeader(event, 'Session-Id')

  if (!id || !reaction || !sessionId) {
    setResponseStatus(event, 400)
    return
  }

  const userId = (await db.select().from(userTable).where(eq(userTable.session_id, sessionId)))[0]?.id

  if (!userId) {
    setResponseStatus(event, 401, 'Unauthorized')
    return
  }

  if (reaction === 'like') {
    try {
      await db.insert(reactionTable).values({
        id: ulid(),
        fk_upload_id: id,
        reaction: reaction as string,
        created_at: Date.now(),
        fk_user_id: userId,
      })
    }
    catch (error) {
      console.error(error)
      setResponseStatus(event, 500)
    }
  }
  else if (reaction === 'dislike') {
    try {
      await db.delete(reactionTable).where(
        and(
          eq(reactionTable.fk_upload_id, id),
          eq(reactionTable.reaction, 'like'),
          eq(reactionTable.fk_user_id, userId),
        ),
      )
    }
    catch (error) {
      console.error(error)
      setResponseStatus(event, 500)
    }
  }
  const hasReacted = db
    .select()
    .from(reactionTable)
    .where(and(
      eq(reactionTable.fk_upload_id, id),
      eq(reactionTable.fk_user_id, userId),
    ))
    .as('reacted')
  const reactions = await db
    .select({ count: count(), reacted: exists(hasReacted) })
    .from(reactionTable)
    .where(eq(reactionTable.fk_upload_id, id))
  return reactions[0]
})
