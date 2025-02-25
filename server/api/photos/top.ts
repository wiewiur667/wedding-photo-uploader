export default defineEventHandler(async (event) => {
  const query = getQuery(event)

  const limit = Number.parseInt(query?.limit ?? '10')

  const db = useDatabase()
  const topPhotos = await db.sql`SELECT * FROM files ORDER BY created_at DESC LIMIT ${limit}`
  const topPhotosData = topPhotos?.rows?.map(row => ({
    id: row.id,
    filename: row.filename,
    mimetype: row.mimetype,
    size: row.size,
  }))

  return topPhotosData
})
