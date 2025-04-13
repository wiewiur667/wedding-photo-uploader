export interface IOffsetResult<T> {
  rows: T[]
  total: number
  limit: number
  offset: number
}
