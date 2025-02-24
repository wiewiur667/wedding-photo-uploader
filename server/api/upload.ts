import { groupBy } from 'lodash-es'

export default defineEventHandler(async (event) => {
  const files = await readMultipartFormData(event) ?? []
  const storage = useStorage('fs')
  const db = useDatabase()

  const groupedFiles = groupBy(files, f => f.name?.split('-')[0])

  const processedFiles = Object.values(groupedFiles).map((group: any) => ({
    name: group[0].filename,
    type: group[0].type,
    size: group[0].size,
    data: group[0].data,
    ...JSON.parse(group[1].data),
  }))

  await db.sql`CREATE TABLE IF NOT EXISTS files (id INTEGER PRIMARY KEY, "name" TEXT, "filelocation" TEXT, "mimetype" TEXT, "size" INTEGER, "created_at" TIMESTAMP, "created_by_name" TEXT, "created_by_session" TEXT)`
  await db.sql`CREATE TABLE IF NOT EXISTS comments (id INTEGER PRIMARY KEY, "fk_Id" INTEGER, "comment" TEXT, "created_at" TIMESTAMP, "created_by_name" TEXT, "created_by_session" TEXT)`

  for (const processed of processedFiles) {
    const fileName = processed.name ?? 'Test'
    const fileURL = `${processed.creatorSessionId}/${fileName}`
    await storage.setItemRaw(fileURL, processed.data)

    const fileLocation = `data:${fileURL}`

    await db.sql`INSERT INTO files ("name", "filelocation", "mimetype", "size", "created_at", "created_by_name", "created_by_session") VALUES (${fileURL}, ${fileLocation}, ${processed.type}, ${processed.size}, ${Date.now()}, ${processed.creatorName}, ${processed.creatorSessionId})`
    if (processed.comment) {
      await db.sql`INSERT INTO comments ("fk_Id", "comment", "created_at", "created_by_name", "created_by_session") VALUES ((SELECT id FROM files WHERE name = ${fileURL}), ${processed.comment}, ${Date.now()}, ${processed.creatorName}, ${processed.creatorSessionId})`
    }
  }
})
