import type { DateTime } from 'luxon'

export interface IUpload {
  id: string
  type: string
  name: string
  commentsCount: number
  reactionsCount: number
  created: DateTime
  reacted: boolean
  byName: string
  approvedForGallery: boolean
}
