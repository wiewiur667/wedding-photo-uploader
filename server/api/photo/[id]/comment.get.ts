import { count, desc, eq, getTableColumns } from 'drizzle-orm'
import { db, withOffset } from '~/db'
import { comment, user } from '~/db/schema'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const { offset, limit } = getQuery(event)

  const offsetVal = Number(offset) ?? 0
  const limitVal = Number(limit) ?? 10

  if (!id) {
    setResponseStatus(event, 400, 'id is required')
    return
  }

  const commentsCountQuery = await
  db
    .select({ count: count() })
    .from(comment)
    .where(eq(comment.fk_upload_id, id?.toString()))

  const commentsQuery = await
  db
    .select({
      ...getTableColumns(comment),
      user_id: user.id,
      user_name: user.name,
    })
    .from(comment)
    .leftJoin(user, eq(comment.fk_user_id, user.id))
    .where(eq(comment.fk_upload_id, id?.toString()))
    .orderBy(desc(comment.created_at))
    .limit(limitVal)
    .offset(offsetVal)

  return {
    result: commentsQuery,
    total: commentsCountQuery[0].count,
    limit: limitVal,
    offset: offsetVal,
  }
})
