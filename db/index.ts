import type { BetterSQLite3Database } from 'drizzle-orm/better-sqlite3'

import process from 'node:process'
import Database from 'better-sqlite3'
import { drizzle } from 'drizzle-orm/better-sqlite3'

const sqlite = new Database('F:\\src\\vue-fire-test\\.data\\db.sqlite3')
const db: BetterSQLite3Database = drizzle(sqlite)

export { db }
