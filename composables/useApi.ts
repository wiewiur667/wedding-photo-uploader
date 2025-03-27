import type { UseFetchOptions } from 'nuxt/app'
import type { IPagedResult } from '~/code/interfaces/PagedResult.interface'

export function $api<T>(...[url, opts]: Parameters<typeof $fetch>) {
  const userStore = useUserStore()
  const { sessionId } = storeToRefs(userStore)
  const headers: HeadersInit = {
    'Session-Id': sessionId.value,
    ...(opts?.headers && opts.headers),
  }

  return $fetch<T>(url, { method: 'POST', headers, ...opts })
}

export function useApi<T = void>(
  url: string | (() => string),
  options?: UseFetchOptions<T>,
) {
  const userStore = useUserStore()
  const { sessionId } = storeToRefs(userStore)

  const headers: HeadersInit = {
    'Session-Id': sessionId.value,
    ...(options?.headers && options.headers) as HeadersInit,
  }

  return useLazyFetch(url, {
    headers,
    method: 'POST',
    ...options,
  })
}

export function useAsyncDataApi<T = void>(
  key: string,
  ...[url, opts]: Parameters<typeof $fetch>
) {
  return useAsyncData<T>(key,
    () => $api(url, opts),
    {
      immediate: false,
    },
  
  )
}

export function getPagedData<T = any>(baseKey: string, url: string, page = 1, limit = 10) {
  return useAsyncData<IPagedResult<T>>(
    baseKey, 
    () => $api(url, 
      { 
        params: { 
          page, 
          limit 
        },
      }), 
    { 
      immediate: false, 
    }
  )
}
