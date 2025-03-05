import { relations } from 'drizzle-orm'
import { int, sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const uploads = sqliteTable('uploads', {
  id: text().notNull(),
  name: text().notNull(),
  location: text().notNull(),
  mime_type: text().notNull(),
  size: int().notNull(),
  created_at: int().notNull(),
  created_by_name: text().notNull(),
  created_by_session: text().notNull(),
})

export const comments = sqliteTable('comments', {
  id: text().notNull(),
  fk_upload_id: text().notNull(),
  comment: text().notNull(),
  created_at: int().notNull(),
  created_by_name: text().notNull(),
  created_by_session: text().notNull(),
})

export const reactions = sqliteTable('reactions', {
  id: text().notNull(),
  fk_upload_id: text().notNull(),
  reaction: text().notNull(),
  created_at: int().notNull(),
  created_by_name: text().notNull(),
  created_by_session: text().notNull(),
})

export const uploadsRelations = relations(uploads, ({ many }) => ({
  comments: many(comments),
}))

export const commentsRelations = relations(comments, ({ one }) => ({
  upload: one(uploads, {
    fields: [comments.fk_upload_id],
    references: [uploads.id],
  }),
}))

export const authorized = sqliteTable('authorized', {
  id: text().notNull(),
  fk_upload_id: int().notNull(),
  by_session: text().notNull(),
  authorized_at: int().notNull(),
})

export const authorizedRelations = relations(authorized, ({ one }) => ({
  upload: one(uploads, {
    fields: [authorized.fk_upload_id],
    references: [uploads.id],
  }),
}))
