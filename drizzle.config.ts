import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'drizzle-kit'

const base = path.resolve(path.dirname(fileURLToPath(import.meta.url)))
export default defineConfig({
  dialect: 'sqlite',
  schema: path.resolve(base, './db/schema.ts'),
  dbCredentials: {
    url: path.resolve(base, '.data/db.sqlite3'),
  },

})
