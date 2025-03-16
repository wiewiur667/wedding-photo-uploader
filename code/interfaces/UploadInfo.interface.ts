export interface IUploadInfo {
  id: string
  name: string
  mimetype: string
  commentsCount: number
  reactionsCount: number
  reacted: boolean
  timestamp: number
  userName: string | null
}
