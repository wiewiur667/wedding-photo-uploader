import type { IPagedResult } from '~/code/interfaces/PagedResult.interface'

export function useAsyncDataApi<T = void>(
  key: string,
  ...[url, opts]: Parameters<typeof $fetch>
) {
  return useAsyncData<T>(key, () => $fetch(url, opts), {
    immediate: false,
  })
}

export function getPagedData<T = any>(baseKey: string, url: string, offset: MaybeRef<number> = 10, limit: MaybeRef<number> = 10, options?: { params?: any }) {
  return {
    limit,
    page: offset,
    ...useAsyncData<IPagedResult<T>>(
      baseKey,
      () => $fetch(url, {
        method: 'POST',
        params: {
          offset: toValue(offset),
          limit: toValue(limit),
          ...options?.params,
        },
      }),
      {
        immediate: false,
      },
    ),
  }
}
