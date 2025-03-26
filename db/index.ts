import type { SQL } from 'drizzle-orm'
import type { SQLiteColumn, SQLiteSelect } from 'drizzle-orm/sqlite-core'
import process from 'node:process'
import { drizzle } from 'drizzle-orm/libsql'
import * as schema from './schema'

import 'dotenv/config'

export const db = drizzle(process.env.DB_FILE_NAME!, {
  schema,
})

export function withOffset<T extends SQLiteSelect>(
  query: T,
  orderByColumn: SQLiteColumn | SQL,
  offset = 0,
  limit = 10,
) {
  return query
    .orderBy(orderByColumn)
    .offset(offset)
    .limit(limit)
}
