import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', () => {
  const { user } = useUserSession()

  const userId = ref(user.value?.id)
  const userName = ref(user.value?.id)
  const isAdmin = ref(false)

  return {
    userId,
    userName,
    isAdmin,
  }
}, {
  persist: true,
})
