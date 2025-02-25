import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', () => {
  const userName = ref('')
  const sessionId = ref('')
  const event = ref('')
  const eventSource = new EventSource('/sse')

  return {
    userName,
    sessionId,
    event,
    eventSource,
  }
}, {
  persist: true,
})
