/**
 * 全域路由守衛：每次開啟 App 時皆先導向登入頁
 * - 以 sessionStorage 判斷「本次 session 是否已登入」
 * - 登入成功後寫入 session_active，才能進入主功能頁
 */
export default defineNuxtRouteMiddleware((to) => {
  // SSR 階段跳過（sessionStorage 只在瀏覽器端存在）
  if (import.meta.server) return

  // 已在登入頁，不做任何跳轉
  if (to.path === '/login') return

  const sessionActive = sessionStorage.getItem('session_active')
  if (!sessionActive) {
    return navigateTo('/login')
  }
})
