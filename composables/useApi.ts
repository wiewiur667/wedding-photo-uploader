export async function useApi<T>(...[url, opts]: Parameters<typeof $fetch>) {
  const appStore = useAppStore()
  const { sessionId } = storeToRefs(appStore)
  const headers: HeadersInit = {
    'Session-Id': sessionId.value,
    ...(opts?.headers && opts.headers),
  }

  return $fetch<T>(url, { method: 'POST', headers, ...opts })
}
