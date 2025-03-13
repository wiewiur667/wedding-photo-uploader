import { count, desc, eq, getTableColumns } from 'drizzle-orm'
import { db, withOffset } from '~/db'
import { comment, user } from '~/db/schema'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const { offset, limit } = getQuery(event)

  const offsetVal = Number(offset) ?? 0
  const limitVal = Number(limit) ?? 10

  const commentsQuery = await withOffset(
    db
      .select({
        ...getTableColumns(comment),
        user_id: user.id,
        user_name: user.name,
        count: count(),
      })
      .from(comment)
      .leftJoin(user, eq(comment.fk_user_id, user.id))
      .where(eq(comment.fk_upload_id, `${id}`))
      .$dynamic(),
    desc(comment.created_at),
    offsetVal,
    limitVal,
  )

  return {
    offset: offsetVal,
    limit: limitVal,
    total: commentsQuery[0].count,
    rows: commentsQuery,

  }
})
