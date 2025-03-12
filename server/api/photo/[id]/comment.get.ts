import { eq, getTableColumns } from 'drizzle-orm'
import { db } from '~/db'
import { comment, user } from '~/db/schema'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const commentsQuery = await db
    .select({
      ...getTableColumns(comment),
      user_id: user.id,
      user_name: user.name,
    })
    .from(comment)
    .leftJoin(user, eq(comment.fk_user_id, user.id))
    .where(eq(comment.fk_upload_id, `${id}`))

  return commentsQuery
})
