import { and, count, desc, eq } from 'drizzle-orm'
import { db } from '~/db'
import { reaction, reaction as reactionTable, user as userTable } from '~/db/schema'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const sessionId = getHeader(event, 'Session-Id')
  const { offset, limit } = getQuery(event)

  const offsetVal = Number(offset) ?? 0
  const limitVal = Number(limit) ?? 10

  if (!id || !sessionId) {
    setResponseStatus(event, 400, 'id, sessionId is required')
    return
  }

  const userId = (await db
    .select()
    .from(userTable)
    .where(eq(userTable.session_id, sessionId)))[0]?.id

  const reactionCountQuery = await db
    .select({ count: count() })
    .from(reactionTable)
    .where(eq(reactionTable.fk_upload_id, id?.toString()))

  const reactionQuery = await db
    .select({
      reaction: reactionTable.reaction,
      createdAt: reactionTable.created_at,
      userId: reactionTable.fk_user_id,
      userName: userTable.name,
    })
    .from(reactionTable)
    .leftJoin(userTable, eq(reactionTable.fk_user_id, userTable.id))
    .where(eq(reactionTable.fk_upload_id, id?.toString()))
    .orderBy(desc(reaction.created_at))
    .limit(limitVal)
    .offset(offsetVal)

  const hasReactedQuery = await db
    .select({ count: count() })
    .from(reactionTable)
    .where(and(eq(reactionTable.fk_upload_id, id?.toString()), eq(reactionTable.fk_user_id, userId)))

  return {
    rows: reactionQuery,
    total: reactionCountQuery[0].count,
    limit: limitVal,
    offset: offsetVal,
    hasReacted: hasReactedQuery[0].count > 0,
  }
})
