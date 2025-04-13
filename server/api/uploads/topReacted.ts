import { and, desc, eq, exists, inArray } from 'drizzle-orm'
import { db } from '~/db'
import { comment, galleryApproval, reaction, upload as uploadTable, user as userTable } from '~/db/schema'

export default defineEventHandler(async (event) => {
  await requireUserSession(event)

  try {
    const uploadsQuery = db
      .select({
        id: uploadTable.id,
        name: uploadTable.name,
        commentsCount: db.$count(comment, and(eq(comment.fk_upload_id, uploadTable.id))),
        reactionsCount: db.$count(reaction, and(eq(reaction.fk_upload_id, uploadTable.id))),
        created: uploadTable.created,
        userName: userTable.name,
        approvedForGallery: galleryApproval.approved,
      })
      .from(uploadTable)
      .leftJoin(userTable, eq(userTable.id, uploadTable.fk_user_id))
      .leftJoin(galleryApproval, eq(galleryApproval.fk_upload_id, uploadTable.id))
      .groupBy(uploadTable.id)
      .limit(10)
      .as('uploads')

    const topUploads = await db.select().from(uploadsQuery).orderBy(desc(uploadsQuery.reactionsCount))
    const toUploadsData = (topUploads ?? []).map(row => ({
      id: row.id,
      name: row.name,
      commentsCount: row.commentsCount ?? 0,
      reactionsCount: row.reactionsCount ?? 0,
      userName: row.userName,
      created: row.created,
      approvedForGallery: row.approvedForGallery ?? false,
    }))

    return toUploadsData
  }
  catch (error) {
    console.error(error)
    setResponseStatus(event, 500)
  }
})
