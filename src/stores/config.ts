import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import type { ApiClient } from '../api/client'
import { createHttpClient } from '../api/client'
import { createMockClient } from '../api/mock'

export const useConfigStore = defineStore('config', () => {
  const baseUrl = ref(import.meta.env.VITE_BASE_URL ?? 'http://localhost:8000')
  const useMock = ref((import.meta.env.VITE_USE_MOCK ?? 'true') === 'true')

  let client: ApiClient = useMock.value ? createMockClient(baseUrl.value) : createHttpClient(baseUrl.value)

  const api = computed(() => client)

  function rebuildClient(token: string | null) {
    client = useMock.value ? createMockClient(baseUrl.value) : createHttpClient(baseUrl.value, token)
    client.setAccessToken(token)
  }

  function setBaseUrl(value: string) {
    baseUrl.value = value
  }

  function setUseMock(value: boolean) {
    useMock.value = value
  }

  return { baseUrl, useMock, api, rebuildClient, setBaseUrl, setUseMock }
})
