export default defineNuxtRouteMiddleware((to) => {

  if (import.meta.server)
    return

  if (to.path === '/login')
    return

  const userUuid = useLocalStorage('userUuid', "")

  if (!userUuid.value) {
    return navigateTo('/login')
  }
})
