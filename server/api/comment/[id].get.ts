import { eq } from 'drizzle-orm'
import { db } from '~/db'
import { comment } from '~/db/schema'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const commentsQuery = await db.select().from(comment).where(eq(comment.fk_upload_id, `${id}`))

  return commentsQuery
})
