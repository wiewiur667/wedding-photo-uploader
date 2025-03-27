import { eq } from 'drizzle-orm'
import { groupBy } from 'lodash-es'
import { DateTime } from 'luxon'
import { ulid } from 'ulid'
import { db } from '~/db'
import { comment, upload as uploadTable, user as userTable } from '~/db/schema'

export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event)
  const { user } = session

  const files = await readMultipartFormData(event) ?? []
  const storage = useStorage('fs')

  const groupedFiles = groupBy(files, f => f.name?.split('-')[0])

  const processedFiles = Object.values(groupedFiles).map((group: any) => ({
    type: group[0].type,
    size: group[0].size,
    data: group[0].data,
    thumbnail: group[2]?.data,
    filename: group[0].filename,
    ...JSON.parse(group[1].data),
  }))

  if (!user) {
    setResponseStatus(event, 401, 'Unauthorized')
    return
  }

  try {
    for (const processed of processedFiles) {
      const fileName = processed.filename

      const timestampedName = `${DateTime.now().toFormat('yyyy-MM-dd_HH-mm-ss')}-${fileName}`

      const fileURL = `${user.id}:${timestampedName}`
      const thumbnailURL = `${user.id}:thumbnail-${timestampedName}`
      await storage.setItemRaw(fileURL, processed.data)
      await storage.setItemRaw(thumbnailURL, processed.thumbnail)

      const fileLocation = `${fileURL}`

      const uploadUlid = ulid()
      await db.insert(uploadTable).values({
        id: uploadUlid,
        location: fileLocation,
        thumbnail: thumbnailURL,
        name: processed.name,
        mime_type: processed.type,
        size: processed.size,
        uploaded: Date.now(),
        created: processed.created,
        fk_user_id: user.id,
      }).run()

      if (processed.comment) {
        await db.insert(comment).values({
          id: ulid(),
          fk_upload_id: uploadUlid,
          comment: processed.comment,
          created_at: Date.now(),
          fk_user_id: user.id,
        })
      }
    }
    setResponseStatus(event, 200)
  }
  catch (error) {
    console.error(error)
    setResponseStatus(event, 500)
  }
})
