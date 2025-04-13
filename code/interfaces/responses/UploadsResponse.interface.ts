import type { IOffsetResult } from '../OffsetResult.interface'

export interface IUploadOffsetResponse extends IOffsetResult<any> {
  rows: {
    id: string
    mimeType: string
    name: string
    commentsCount: number
    reactionsCount: number
    created: number // Timestamp in milliseconds
    reacted: boolean
    isOwner: boolean
    userName: string
    approvedForGallery: boolean
  }[]

}
