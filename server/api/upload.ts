import { groupBy } from 'lodash-es'
import { DateTime } from 'luxon'
import { ulid } from 'ulid'
import { db } from '~/db'
import { comments, uploads } from '~/db/schema'

export default defineEventHandler(async (event) => {
  const files = await readMultipartFormData(event) ?? []
  const storage = useStorage('fs')

  const groupedFiles = groupBy(files, f => f.name?.split('-')[0])

  const processedFiles = Object.values(groupedFiles).map((group: any) => ({
    type: group[0].type,
    size: group[0].size,
    data: group[0].data,
    filename: group[0].name,
    ...JSON.parse(group[1].data),
  }))

  try {
    for (const processed of processedFiles) {
      const fileName = processed.filename

      const timestampedName = `${DateTime.now().toFormat('yyyy-MM-dd_HH-mm-ss')}-${fileName}`

      const fileURL = `${processed.creatorSessionId}:${timestampedName}`
      await storage.setItemRaw(fileURL, processed.data)

      const fileLocation = `${fileURL}`

      const uploadUlid = ulid()
      await db.insert(uploads).values({
        id: uploadUlid,
        location: fileLocation,
        name: processed.name,
        mime_type: processed.type,
        size: processed.size,
        created_at: Date.now(),
        created_by_name: processed.creatorName,
        created_by_session: processed.creatorSessionId,
      }).run()

      if (processed.comment) {
        await db.insert(comments).values({
          id: ulid(),
          fk_upload_id: uploadUlid,
          comment: processed.comment,
          created_at: Date.now(),
          created_by_name: processed.creatorName,
          created_by_session: processed.creatorSessionId,
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
