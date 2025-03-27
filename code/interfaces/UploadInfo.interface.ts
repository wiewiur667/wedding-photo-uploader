export interface IUploadInfo {
  id: string
  name: string
  mimetype: string
  commentsCount: number
  reactionsCount: number
  reacted: boolean
  created: number
  userName: string | null
}
