import { eq } from 'drizzle-orm'

import { ulid } from 'ulid'

import { db } from '~/db'
import { comment as commentTable, user as userTable } from '~/db/schema'

export default defineEventHandler(async (event) => {
  const user = await getUserSession(event)
  if (!user) {
    setResponseStatus(event, 401, 'Unauthorized')
    return
  }

  const uploadId = getRouterParam(event, 'id')
  const { comment } = await readBody(event)

  if (!uploadId || !comment) {
    setResponseStatus(event, 400, 'id, comment-Id are required')
    return
  }

  try {
    const id = ulid()
    await db.insert(commentTable).values({
      id,
      fk_upload_id: uploadId!,
      comment,
      created_at: Date.now(),
      fk_user_id: user.id,
    })

    const newComment = (await db.select().from(commentTable).where(eq(commentTable.id, id)))[0]

    return newComment
  }
  catch (error) {
    console.error(error)
    setResponseStatus(event, 500)
  }
})
