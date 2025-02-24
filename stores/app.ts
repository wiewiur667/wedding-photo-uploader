import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', () => {
  const userName = ref('')
  const sessionId = ref('')
  const event = ref('')
  const eventSource = new EventSource('http://localhost:3000/sse')

  eventSource.onmessage = (sse) => {
    event.value = JSON.parse(sse.data)
  }

  return {
    userName,
    sessionId,
    event,
  }
}, {
  persist: true,
})
