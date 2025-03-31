import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', () => {
  const { user } = useUserSession()

  const userId = ref(user.value?.id)
  const userName = ref(user.value?.name)
  const isAdmin = ref(user.value?.isAdmin)

  return {
    userId,
    userName,
    isAdmin,
  }
}, {
  persist: true,
})
