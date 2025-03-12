import { and, count, eq } from 'drizzle-orm'
import { db } from '~/db'
import { reaction } from '~/db/schema'

export default defineEventHandler(async (event) => {
  const { id, sessionId } = await readBody(event)
  const reactionsAmountQuery = await db
    .select({ count: count() })
    .from(reaction)
    .where(eq(reaction.fk_upload_id, `${id}`))
  const hasReactedQuery = await db
    .select({ count: count() })
    .from(reaction)
    .where(and(eq(reaction.fk_upload_id, `${id}`), eq(reaction.fk_user_id, sessionId)))

  return {
    reactionsAmount: reactionsAmountQuery[0].count,
    hasReacted: hasReactedQuery[0].count > 0,
  }
})
