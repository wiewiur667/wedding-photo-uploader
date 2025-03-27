import { relations } from 'drizzle-orm'
import { int, sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const upload = sqliteTable('upload', {
  id: text().notNull(),
  name: text().notNull(),
  location: text().notNull(),
  thumbnail: text().notNull(),
  mime_type: text().notNull(),
  size: int().notNull(),
  uploaded: int().notNull(),
  created: int().notNull(),
  fk_user_id: text().notNull(),
})

export const user = sqliteTable('user', {
  id: text().notNull(),
  name: text().notNull(),
  created_at: int().notNull(),
  is_admin: int().notNull().$type<boolean>(),
})

export const comment = sqliteTable('comment', {
  id: text().notNull(),
  fk_upload_id: text().notNull(),
  comment: text().notNull(),
  created_at: int().notNull(),
  fk_user_id: text().notNull(),
})

export const reaction = sqliteTable('reaction', {
  id: text().notNull(),
  fk_upload_id: text().notNull(),
  reaction: text().notNull(),
  created_at: int().notNull(),
  fk_user_id: text().notNull(),
})

export const galleryApproval = sqliteTable('gallery_approval', {
  id: text().notNull(),
  fk_upload_id: text().notNull(),
  approved: int().notNull().$type<boolean>(),
  approved_at: int().notNull(),
  fk_user_id: text().notNull(),
})
export const galleryApprovalRelations = relations(galleryApproval, ({ one }) => ({
  upload: one(upload, {
    fields: [galleryApproval.fk_upload_id],
    references: [upload.id],
  }),
}))

export const uploadsRelations = relations(upload, ({ many }) => ({
  comments: many(comment),
}))

export const commentsRelations = relations(comment, ({ one }) => ({
  upload: one(upload, {
    fields: [comment.fk_upload_id],
    references: [upload.id],
  }),
}))

export const authorized = sqliteTable('authorized', {
  id: text().notNull(),
  fk_upload_id: int().notNull(),
  fk_user_id: text().notNull(),
  authorized_at: int().notNull(),
})

export const authorizedRelations = relations(authorized, ({ one }) => ({
  upload: one(upload, {
    fields: [authorized.fk_upload_id],
    references: [upload.id],
  }),
}))
