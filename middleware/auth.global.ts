export default defineNuxtRouteMiddleware((to) => {
  const { userName, sessionId } = storeToRefs(useAppStore())

  if (to.path === '/welcome')
    return

  if (!userName.value || !sessionId.value) {
    return navigateTo('/welcome')
  }
})
