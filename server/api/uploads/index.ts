import { and, desc, eq, exists, inArray } from 'drizzle-orm'
import { db } from '~/db'
import { comment, galleryApproval, reaction, upload as uploadTable, user as userTable } from '~/db/schema'

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event)

  const query = getQuery(event)
  const limitVal = Number.parseInt(query?.limit as string ?? '10')
  const offsetVal = Number.parseInt(query?.offset as string ?? '0')

  const body = await readBody(event)

  try {
    const uploadsCount = await db.$count(uploadTable)
    const uploadsQuery = db
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
            .where(and(eq(reaction.fk_upload_id, uploadTable.id), eq(reaction.fk_user_id, user.id))),
        ),
        createdAt: uploadTable.created_at,
        userName: userTable.name,
        approvedForGallery: galleryApproval.approved,
      })
      .from(uploadTable)
      .leftJoin(userTable, eq(userTable.id, uploadTable.fk_user_id))
      .leftJoin(galleryApproval, eq(galleryApproval.fk_upload_id, uploadTable.id))
      .groupBy(uploadTable.id)
      .orderBy(desc(uploadTable.created_at))
      .limit(limitVal)
      .offset(offsetVal)

    if (body?.ids)
      uploadsQuery.where(inArray(uploadTable.id, []))

    const topUploads = await uploadsQuery
    const toUploadsData = (topUploads ?? []).map(row => ({
      id: row.id,
      name: row.name,
      mimeType: row.mimetype,
      commentsCount: row.commentsCount ?? 0,
      reactionsCount: row.reactionsCount ?? 0,
      reacted: !!row.reacted,
      userName: row.userName,
      createdAt: row.createdAt,
      approvedForGallery: row.approvedForGallery ?? false,
    }))

    return {
      rows: toUploadsData,
      total: uploadsCount,
      limit: limitVal,
      offset: offsetVal,
    }
  }
  catch (error) {
    console.error(error)
    setResponseStatus(event, 500)
  }
})
