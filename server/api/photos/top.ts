import { desc } from 'drizzle-orm'
import { db } from '~/db'
import { uploads } from '~/db/schema'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)

  const limit = Number.parseInt(query?.limit as string ?? '10')

  const topPhotos = await db.select().from(uploads).orderBy(desc(uploads.created_at)).limit(limit)

  const topPhotosData = topPhotos?.map(row => ({
    id: row.id,
    name: row.name,
    mimetype: row.mime_type,
  }))

  return topPhotosData
})
