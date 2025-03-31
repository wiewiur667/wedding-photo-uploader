import { desc, eq } from 'drizzle-orm'
import { db } from '~/db'
import { upload as uploadTable, user as userTable } from '~/db/schema'

export default defineEventHandler(async (event) => {
  const { user } = requireUserSession(event)

  const topQuery = db
    .select({
      id: uploadTable.id,
      userName: userTable.name,
    })
    .from(uploadTable)
    .leftJoin(userTable, eq(userTable.id, uploadTable.fk_user_id))
    .orderBy(desc(uploadTable.created))
    .as('topQuery')

  const albumsQuery = await db.select().from(topQuery).groupBy(topQuery.userName)

  return albumsQuery
})
