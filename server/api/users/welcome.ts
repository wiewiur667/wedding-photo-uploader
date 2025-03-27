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
    setResponseStatus(event, 400, 'Name and Code are required')
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

    const userData = await db.query.user.findFirst({
      where: (eq(userTable.id, id)),
    })

    if (!userData) {
      setResponseStatus(event, 404, 'User not found')
      return
    }

    await setUserSession(event, {
      user: {
        isAdmin: !!userData.is_admin,
        id: userData.id,
        name: userData.name,
      },
    })
  }
  catch (error) {
    console.error(error)
    setResponseStatus(event, 500)
  }
})
