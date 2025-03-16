import type { DateTime } from 'luxon'

export interface IUpload {
  id: string
  type: string
  name: string
  commentsCount: number
  reactionsCount: number
  createdAt: DateTime
  reacted: boolean
  byName: string
}
