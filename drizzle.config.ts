import process from 'node:process'
import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  dialect: 'sqlite',
  schema: './db/schema.ts',
  dbCredentials: {
    url: process.env.DB_FILE_NAME ?? '',
  },

})
