import { eq } from 'drizzle-orm'
import { db } from '~/db'
import { user as userTable } from '~/db/schema'

export default defineEventHandler(async (event) => {
  const sessionId = getHeader(event, 'Session-Id')

  if (!sessionId) {
    setResponseStatus(event, 400, 'Session-Id is required')
    return
  }

  const user = (await db.select().from(userTable).where(eq(userTable.session_id, sessionId)))[0]

  if (!user) {
    setResponseStatus(event, 401, 'Unauthorized')
    return
  }

  return user
})
