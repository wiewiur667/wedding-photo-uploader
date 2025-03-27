import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', () => {
  const userName = ref('')
  const userId = ref('')
  const event = ref('')
  // const eventSource = new EventSource('/sse')

  return {
    userId,
    userName,
    event,
    // eventSource,
  }
}, {
  persist: true,
})
