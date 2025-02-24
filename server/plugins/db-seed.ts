export default defineNitroPlugin(async (_nitro) => {
  const db = useDatabase()

  await db.sql`CREATE TABLE IF NOT EXISTS files (id INTEGER PRIMARY KEY, "name" TEXT, "filelocation" TEXT, "mimetype" TEXT, "size" INTEGER, "created_at" TIMESTAMP, "created_by_name" TEXT, "created_by_session" TEXT)`
  await db.sql`CREATE TABLE IF NOT EXISTS comments (id INTEGER PRIMARY KEY, "fk_Id" INTEGER, "comment" TEXT, "created_at" TIMESTAMP, "created_by_name" TEXT, "created_by_session" TEXT)`

  return { result: 'success' }
})
