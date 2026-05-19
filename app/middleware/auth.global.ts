export default defineNuxtRouteMiddleware((to) => {

  if (to.path === '/login')
    return

  const userUuid = useLocalStorage('userUuid', "")

  if (!userUuid.value) {
    return navigateTo('/login')
  }
})
