import createClient from 'openapi-fetch'
import type { paths } from '#shared/types/api'

export default defineNuxtPlugin(() => {
  
  const apiBase = useRuntimeConfig().public.apiBase

  const api = createClient<paths>({ baseUrl: apiBase })

  return {
    provide: {
      api
    }
  }
})
