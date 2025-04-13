import type { IOffsetResult } from '~/code/interfaces/OffsetResult.interface'

export function useAsyncDataApi<T = void>(
  key: string,
  ...[url, opts]: Parameters<typeof $fetch>
) {
  return useAsyncData<T>(key, () => $fetch<T>(url, opts), {
    immediate: false,
  })
}

export function useOffsetData<R = any, D = R>(
  baseKey: string,
  url: string,
  options?: {
    params?: any
    transformRow?: (data: R) => D
  },
) {
  const total = ref<number | null>(null)
  const offset = ref(0)
  const limit = ref(10)
  return {
    limit,
    offset,
    total,
    ...useAsyncData(
      `${baseKey}-${offset.value}-${limit.value}`,
      () => $fetch<IOffsetResult<R>>(url, {
        method: 'POST',
        params: {
          offset: toValue(offset),
          limit: toValue(limit),
          ...options?.params,
        },
      }),
      {
        immediate: false,
        transform: (data: IOffsetResult<R>): IOffsetResult<D> => {
          total.value = data.total
          return {
            ...data,
            total: data.total,
            rows: (options?.transformRow ? data.rows.map(options.transformRow) : data.rows) as D[],
          }
        },
      },
    ),
  }
}
