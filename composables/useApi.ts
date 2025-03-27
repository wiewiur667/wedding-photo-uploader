import type { IPagedResult } from '~/code/interfaces/PagedResult.interface'

export function useAsyncDataApi<T = void>(
  key: string,
  ...[url, opts]: Parameters<typeof $fetch>
) {
  return useAsyncData<T>(key, () => $fetch(url, opts), {
    immediate: false,
  })
}

export function getPagedData<T = any>(baseKey: string, url: string, page = 1, limit = 10) {
  return useAsyncData<IPagedResult<T>>(
    baseKey,
    () => $fetch(url, {
      method: 'POST',
      params: {
        page,
        limit,
      },
    }),
    {
      immediate: false,
    },
  )
}
