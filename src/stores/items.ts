import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Item, ItemStats } from '../api/types'
import { useConfigStore } from './config'

export const useItemsStore = defineStore('items', () => {
  const items = ref<Item[]>([])
  const total = ref(0)
  const skip = ref(0)
  const limit = ref(20)
  const categoryId = ref<number | null>(null)
  const nameContains = ref('')
  const loading = ref(false)
  const error = ref<string | null>(null)
  const stats = ref<ItemStats | null>(null)

  const hasMore = () => skip.value + items.value.length < total.value

  async function refresh() {
    skip.value = 0
    await load(false)
  }

  async function loadMore() {
    if (!hasMore() || loading.value) return
    skip.value += limit.value
    await load(true)
  }

  async function load(append: boolean) {
    loading.value = true
    if (!append) error.value = null
    try {
      const page = await useConfigStore().api.listItems({
        skip: skip.value,
        limit: limit.value,
        category_id: categoryId.value,
        name_contains: nameContains.value || undefined,
      })
      items.value = append ? [...items.value, ...page.items] : page.items
      total.value = page.total
    } catch (e) {
      error.value = String(e)
      if (!append) items.value = []
    } finally {
      loading.value = false
    }
  }

  async function loadStats() {
    stats.value = await useConfigStore().api.getItemStats()
  }

  async function getById(id: number) {
    return useConfigStore().api.getItem(id)
  }

  async function create(body: Record<string, unknown>) {
    loading.value = true
    error.value = null
    try {
      const created = await useConfigStore().api.createItem(body)
      await refresh()
      return created
    } catch (e) {
      error.value = String(e)
      return null
    } finally {
      loading.value = false
    }
  }

  async function update(id: number, body: Record<string, unknown>) {
    loading.value = true
    error.value = null
    try {
      const updated = await useConfigStore().api.updateItem(id, body)
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
      await useConfigStore().api.deleteItem(id)
      await refresh()
      return true
    } catch (e) {
      error.value = String(e)
      return false
    } finally {
      loading.value = false
    }
  }

  return {
    items,
    total,
    skip,
    limit,
    categoryId,
    nameContains,
    loading,
    error,
    stats,
    hasMore,
    refresh,
    loadMore,
    loadStats,
    getById,
    create,
    update,
    remove,
  }
})
