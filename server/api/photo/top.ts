import { and, count, desc, eq, exists } from 'drizzle-orm'
import { db } from '~/db'
import { comment, reaction, upload, user as userTable } from '~/db/schema'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const sessionId = getHeader(event, 'Session-Id')
  const limit = Number.parseInt(query?.limit as string ?? '10')

  if (!sessionId) {
    setResponseStatus(event, 400, 'Session-Id header is required')
    return
  }

  const userId = (await db.select().from(userTable).where(eq(userTable.session_id, sessionId)))[0]?.id

  if (!userId) {
    setResponseStatus(event, 401, 'Unauthorized')
    return
  }

  try {
    const reacted = db
      .select()
      .from(reaction)
      .where(and(eq(reaction.fk_upload_id, upload.id), eq(
        reaction.fk_user_id,
        userId,
      )))
      .as('reacted')
    const topPhotos = await db
      .select({
        id: upload.id,
        name: upload.name,
        mimetype: upload.mime_type,
        commentsCount: count(comment.id),
        reactionsCount: count(reaction.id),
        reacted: exists(reacted),
      })
      .from(upload)
      .leftJoin(comment, eq(comment.fk_upload_id, upload.id))
      .leftJoin(reaction, eq(reaction.fk_upload_id, upload.id))
      .groupBy(upload.id)
      .orderBy(desc(upload.created_at))
      .limit(limit)

    const topPhotosData = (topPhotos ?? []).map(row => ({
      id: row.id,
      name: row.name,
      mimetype: row.mimetype,
      commentsCount: row.commentsCount ?? 0,
      reactionsCount: row.reactionsCount ?? 0,
      reacted: !!row.reacted,
    }))

    return topPhotosData
  }
  catch (error) {
    console.error(error)
    setResponseStatus(event, 500)
  }
})
