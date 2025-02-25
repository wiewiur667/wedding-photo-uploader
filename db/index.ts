import type { BetterSQLite3Database } from 'drizzle-orm/better-sqlite3'
import process from 'node:process'
import Database from 'better-sqlite3'
import { drizzle } from 'drizzle-orm/better-sqlite3'

const sqlite = new Database(process.env.DB_FILE_NAME)
const db: BetterSQLite3Database = drizzle(sqlite)

export { db }
