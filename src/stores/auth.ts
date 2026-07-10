import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import type { User } from '../api/types'
import { useConfigStore } from './config'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const accessToken = ref<string | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const isAuthenticated = computed(() => !!accessToken.value)
  const canWrite = computed(() => isAuthenticated.value || useConfigStore().useMock)

  function applyToken(token: string | null) {
    accessToken.value = token
    useConfigStore().rebuildClient(token)
    useConfigStore().api.setAccessToken(token)
  }

  async function login(email: string, password: string) {
    loading.value = true
    error.value = null
    try {
      const token = await useConfigStore().api.login(email, password)
      applyToken(token.access_token)
      user.value = await useConfigStore().api.getMe()
      return true
    } catch (e) {
      error.value = String(e)
      return false
    } finally {
      loading.value = false
    }
  }

  async function register(email: string, password: string) {
    loading.value = true
    error.value = null
    try {
      user.value = await useConfigStore().api.register(email, password)
      const token = await useConfigStore().api.login(email, password)
      applyToken(token.access_token)
      return true
    } catch (e) {
      error.value = String(e)
      return false
    } finally {
      loading.value = false
    }
  }

  function logout() {
    user.value = null
    applyToken(null)
    error.value = null
  }

  return { user, accessToken, loading, error, isAuthenticated, canWrite, login, register, logout, applyToken }
})
