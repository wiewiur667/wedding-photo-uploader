import type { UseFetchOptions } from 'nuxt/app'

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
