import type { DateTime } from "luxon";

export interface IComment {
  id: string,
  fkUploadId: string,
  fkUserId: string,
  comment: string,
  createdAt: DateTime,
  userName: string
}