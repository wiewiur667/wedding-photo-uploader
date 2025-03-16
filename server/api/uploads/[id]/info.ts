import type { IUploadInfo } from '~/code/interfaces/UploadInfo.interface'
import { and, count, eq, exists } from 'drizzle-orm'
import { db } from '~/db'
import { comment, reaction, upload as uploadTable, user as userTable } from '~/db/schema'

export default defineEventHandler(async (event) => {
  const sessionId = getHeader(event, 'Session-Id')
  const id = getRouterParam(event, 'id')

  if (!sessionId || !id) {
    setResponseStatus(event, 400, 'Session-Id header is required')
    return
  }

  const user = (await db.select().from(userTable).where(eq(userTable.session_id, sessionId)))[0]
  if (!user) {
    setResponseStatus(event, 401, 'Unauthorized')
    return
  }

  try {
    const upload = db
      .select({
        id: uploadTable.id,
        name: uploadTable.name,
        mimetype: uploadTable.mime_type,
        commentsCount: db.$count(comment, and(eq(comment.fk_upload_id, uploadTable.id))),
        reactionsCount: db.$count(reaction, and(eq(reaction.fk_upload_id, uploadTable.id))),
        reacted: exists(
          db
            .select()
            .from(reaction)
            .where(and(
              eq(reaction.fk_upload_id, uploadTable.id),
              eq(reaction.fk_user_id, user.id),
            )),
        ),
        timestamp: uploadTable.created_at,
        userName: userTable.name,
      })
      .from(uploadTable)
      .leftJoin(userTable, eq(userTable.id, uploadTable.fk_user_id))
      .groupBy(uploadTable.id)
      .where(eq(uploadTable.id, id))

    const result = (await upload)[0]
    return {...result, reacted: !!result.reacted} as IUploadInfo
  }
  catch (error) {
    console.error(error)
    setResponseStatus(event, 500)
  }
})
