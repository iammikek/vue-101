<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useCategoriesStore } from '../stores/categories'
import { useConfigStore } from '../stores/config'
import { useItemsStore } from '../stores/items'

const auth = useAuthStore()
const config = useConfigStore()
const categories = useCategoriesStore()
const items = useItemsStore()
const search = ref('')

onMounted(async () => {
  await categories.refresh()
  await items.refresh()
})

function applySearch() {
  items.nameContains = search.value.trim()
  items.refresh()
}

function onCategoryFilter(event: Event) {
  const value = (event.target as HTMLSelectElement).value
  items.categoryId = value ? Number(value) : null
  items.refresh()
}
</script>

<template>
  <section>
    <div class="toolbar">
      <div>
        <h1>Items</h1>
        <p class="muted">{{ config.useMock ? 'Mock mode' : 'Live API' }} · {{ config.baseUrl }}</p>
      </div>
      <RouterLink v-if="auth.canWrite" class="button" to="/items/new">Create item</RouterLink>
    </div>

    <div v-if="!auth.canWrite" class="banner">Sign in to create, edit, or delete items.</div>
    <p v-if="items.error" class="error">{{ items.error }}</p>

    <div class="panel toolbar">
      <input v-model="search" placeholder="Search name" @keyup.enter="applySearch" />
      <button type="button" @click="applySearch">Search</button>
      <select @change="onCategoryFilter">
        <option value="">All categories</option>
        <option v-for="category in categories.categories" :key="category.id" :value="category.id">
          {{ category.name }}
        </option>
      </select>
    </div>

    <div class="panel">
      <ul class="list">
        <li v-for="item in items.items" :key="item.id">
          <RouterLink :to="`/items/${item.id}`">
            <strong>{{ item.name }}</strong>
            <div class="muted">{{ item.category?.name ?? 'Uncategorized' }}</div>
          </RouterLink>
          <span>${{ item.price.toFixed(2) }}</span>
        </li>
      </ul>
      <p v-if="!items.loading && !items.items.length">No items yet.</p>
      <button v-if="items.hasMore()" class="secondary" type="button" :disabled="items.loading" @click="items.loadMore()">
        Load more ({{ items.items.length }}/{{ items.total }})
      </button>
    </div>
  </section>
</template>

<style scoped>
.muted { color: #64748b; font-size: 0.9rem; }
</style>
