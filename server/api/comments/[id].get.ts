import { eq } from 'drizzle-orm'
import { db } from '~/db'
import { comments } from '~/db/schema'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const commentsQuery = await db.select().from(comments).where(eq(comments.fk_upload_id, `${id}`))

  return commentsQuery
})
