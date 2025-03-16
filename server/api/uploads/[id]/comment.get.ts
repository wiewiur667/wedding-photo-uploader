import { asc, count, eq, getTableColumns } from 'drizzle-orm'
import { db } from '~/db'
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
      id: comment.id,
      fk_upload_id: comment.fk_upload_id,
      fk_user_id: comment.fk_user_id,
      comment: comment.comment,
      created_at: comment.created_at,
      user_name: user.name,
    })
    .from(comment)
    .leftJoin(user, eq(comment.fk_user_id, user.id))
    .where(eq(comment.fk_upload_id, id?.toString()))
    .orderBy(asc(comment.created_at))
    .limit(limitVal)
    .offset(offsetVal)

  return {
    rows: commentsQuery,
    total: commentsCountQuery[0].count,
    limit: limitVal,
    offset: offsetVal,
  }
})
