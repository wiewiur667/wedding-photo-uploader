import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', () => {
  const userId = ref('')
  const userName = ref('')
  const sessionId = ref('')
  const isAdmin = ref(false)

  return {
    userId,
    userName,
    sessionId,
    isAdmin,
  }
}, {
  persist: true,
})
