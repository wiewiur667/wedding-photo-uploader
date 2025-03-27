import { desc, eq } from 'drizzle-orm'
import { db } from '~/db'
import { reaction, reaction as reactionTable, user as userTable } from '~/db/schema'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  if (!id) {
    setResponseStatus(event, 400, 'id is required')
    return
  }

  const reactions = await db
    .select({
      reaction: reactionTable.reaction,
      createdAt: reactionTable.created_at,
      userId: reactionTable.fk_user_id,
      userName: userTable.name,
    })
    .from(reactionTable)
    .leftJoin(userTable, eq(reactionTable.fk_user_id, userTable.id))
    .where(eq(reactionTable.fk_upload_id, id?.toString()))
    .orderBy(desc(reaction.created_at))

  return reactions
})
