import { sql } from 'drizzle-orm'
import { ulid } from 'ulid'
import { db } from '~/db'
import { user } from '~/db/schema'

export default defineEventHandler(async (event) => {
  const { name } = await readBody(event)
  const sessionId = getHeader(event, 'Session-Id')

  if (!name || !sessionId) {
    setResponseStatus(event, 400, 'Name and Session-Id are required')
    return
  }

  const existingUser = await db.select().from(user).where(sql`lower(name) = lower(${name})`)

  if (existingUser.length) {
    setResponseStatus(event, 409, 'User already exists')
    return
  }

  try {
    await db.insert(user).values({
      id: ulid(),
      session_id: sessionId,
      name,
      created_at: Date.now(),
    })
    return true
  }
  catch (error) {
    console.error(error)
    setResponseStatus(event, 500)
  }
})
