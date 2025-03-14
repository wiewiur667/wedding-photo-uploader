export default defineNuxtRouteMiddleware(async (to) => {
  const { userName, sessionId, userId, isAdmin } = storeToRefs(useUserStore())

  if (to.path === '/welcome')
    return

  try {
    const user = await useApi('/api/user')

    if (user) {
      userId.value = user.id
      userName.value = user.name
      sessionId.value = user.session_id
      isAdmin.value = user.is_admin
    }
  }
  catch {
    userName.value = ''
    sessionId.value = ''

    return navigateTo('/welcome')
  }
})
