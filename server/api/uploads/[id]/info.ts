import type { IUploadInfo } from '~/code/interfaces/UploadInfo.interface'
import { and, eq, exists } from 'drizzle-orm'
import { db } from '~/db'
import { comment, reaction, upload as uploadTable, user as userTable } from '~/db/schema'

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event)
  const id = getRouterParam(event, 'id')

  if (!id) {
    setResponseStatus(event, 400, 'id is required')
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
        created: uploadTable.created,
        userName: userTable.name,
      })
      .from(uploadTable)
      .leftJoin(userTable, eq(userTable.id, uploadTable.fk_user_id))
      .groupBy(uploadTable.id)
      .where(eq(uploadTable.id, id))

    const result = (await upload).at(0)
    return { ...result, reacted: !!result?.reacted } as IUploadInfo
  }
  catch (error) {
    console.error(error)
    setResponseStatus(event, 500)
  }
})
