import { ulid } from 'ulid'

import { db } from '~/db'
import { comments } from '~/db/schema'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const { comment, userName, userSessionId } = await readBody(event)

  if (!id || !comment || !userName || !userSessionId) {
    setResponseStatus(event, 400)
  }

  console.log('id:', id, { comment, userName, userSessionId })
  try {
    await db.insert(comments).values({
      id: ulid(),
      fk_upload_id: id!,
      comment,
      created_at: Date.now(),
      created_by_name: userName,
      created_by_session: userSessionId,
    })
    return true
  }
  catch (error) {
    console.error(error)
    setResponseStatus(event, 500)
  }
})
