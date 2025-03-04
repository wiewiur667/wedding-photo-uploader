import process from 'node:process'
import { drizzle } from 'drizzle-orm/libsql'
import 'dotenv/config'

const db = drizzle(process.env.DB_FILE_NAME!)
export { db }
