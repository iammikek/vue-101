<script setup lang="ts">
import { onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useCategoriesStore } from '../stores/categories'

const auth = useAuthStore()
const categories = useCategoriesStore()

onMounted(() => categories.refresh())
</script>

<template>
  <section>
    <div class="toolbar">
      <h1>Categories</h1>
      <RouterLink v-if="auth.canWrite" class="button" to="/categories/new">Create category</RouterLink>
    </div>
    <div v-if="!auth.canWrite" class="banner">Sign in to create, edit, or delete categories.</div>
    <div class="panel">
      <ul class="list">
        <li v-for="category in categories.categories" :key="category.id">
          <RouterLink :to="`/categories/${category.id}`">
            <strong>{{ category.name }}</strong>
            <div class="muted">{{ category.description || 'No description' }}</div>
          </RouterLink>
        </li>
      </ul>
    </div>
  </section>
</template>

<style scoped>
.muted { color: #64748b; }
</style>
