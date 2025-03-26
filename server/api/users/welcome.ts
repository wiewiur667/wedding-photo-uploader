import { eq, sql } from 'drizzle-orm'
import { ulid } from 'ulid'
import { db } from '~/db'
import { user as userTable } from '~/db/schema'

export default defineEventHandler(async (event) => {
  const { name, code } = await readBody(event)

  const runtimeConfig = useRuntimeConfig()

  const { userCode, adminCode } = runtimeConfig

  if (code !== userCode && code !== adminCode) {
    setResponseStatus(event, 401, 'Invalid code')
    return
  }

  if (!name || !code) {
    setResponseStatus(event, 400, 'Name and Session-Id are required')
    return
  }

  const existingUser = await db.select().from(userTable).where(sql`lower(name) = lower(${name})`)

  if (existingUser.length) {
    setResponseStatus(event, 409, 'User already exists')
    return
  }

  try {
    const id = ulid()
    await db.insert(userTable).values({
      id,
      name,
      created_at: Date.now(),
      is_admin: code === adminCode,
    })

    const user = await db.query.user.findFirst({
      where: (eq(userTable.id, id)),
    })

    await setUserSession(event, {
      user,
    })
  }
  catch (error) {
    console.error(error)
    setResponseStatus(event, 500)
  }
})
