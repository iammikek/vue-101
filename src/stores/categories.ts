import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Category } from '../api/types'
import { useConfigStore } from './config'

export const useCategoriesStore = defineStore('categories', () => {
  const categories = ref<Category[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function refresh() {
    loading.value = true
    error.value = null
    try {
      const page = await useConfigStore().api.listCategories(0, 100)
      categories.value = page.items
    } catch (e) {
      error.value = String(e)
      categories.value = []
    } finally {
      loading.value = false
    }
  }

  async function getById(id: number) {
    return useConfigStore().api.getCategory(id)
  }

  async function create(name: string, description: string | null) {
    loading.value = true
    error.value = null
    try {
      const created = await useConfigStore().api.createCategory({ name, description })
      await refresh()
      return created
    } catch (e) {
      error.value = String(e)
      return null
    } finally {
      loading.value = false
    }
  }

  async function update(id: number, name: string, description: string | null) {
    loading.value = true
    error.value = null
    try {
      const updated = await useConfigStore().api.updateCategory(id, { name, description })
      await refresh()
      return updated
    } catch (e) {
      error.value = String(e)
      return null
    } finally {
      loading.value = false
    }
  }

  async function remove(id: number) {
    loading.value = true
    error.value = null
    try {
      await useConfigStore().api.deleteCategory(id)
      await refresh()
      return true
    } catch (e) {
      error.value = String(e)
      return false
    } finally {
      loading.value = false
    }
  }

  return { categories, loading, error, refresh, getById, create, update, remove }
})
