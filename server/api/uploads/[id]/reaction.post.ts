import { and, eq } from 'drizzle-orm'
import { ulid } from 'ulid'

import { db } from '~/db'
import { reaction as reactionTable, user as userTable } from '~/db/schema'

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event)

  const id = getRouterParam(event, 'id')
  const { reaction } = getQuery(event)

  if (!id || !reaction) {
    setResponseStatus(event, 400)
    return {}
  }

  const userId = (await db.select().from(userTable).where(eq(userTable.id, user.id)))[0]?.id

  if (!userId) {
    setResponseStatus(event, 401, 'Unauthorized')
    return {}
  }

  let reacted = false
  const hasReacted = await db
    .$count(reactionTable, and(
      eq(reactionTable.fk_upload_id, id),
      eq(reactionTable.fk_user_id, userId),
    ))

  if (hasReacted > 0)
    reacted = true

  if (reaction === 'like' && reacted === false) {
    try {
      await db.insert(reactionTable).values({
        id: ulid(),
        fk_upload_id: id,
        reaction: reaction as string,
        created_at: Date.now(),
        fk_user_id: userId,
      })
      reacted = true
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

      reacted = false
    }
    catch (error) {
      console.error(error)
      setResponseStatus(event, 500)
    }
  }

  const totalReactions = await db.$count(reactionTable, eq(reactionTable.fk_upload_id, id))

  return {
    reacted,
    totalReactions,
  }
})
