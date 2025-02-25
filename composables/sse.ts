export function useServerEvents() {
  const eventSource = new EventSource('/sse')

  return {
    eventSource,
  }
}
