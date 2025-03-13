export interface IPagedResult<T> {
  rows: T[]
  total: number
  limit: number
  offset: number
}
