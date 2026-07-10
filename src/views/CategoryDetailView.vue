<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useCategoriesStore } from '../stores/categories'
import type { Category } from '../api/types'

const props = defineProps<{ id: string }>()
const router = useRouter()
const auth = useAuthStore()
const categories = useCategoriesStore()
const category = ref<Category | null>(null)

onMounted(async () => {
  category.value = await categories.getById(Number(props.id))
})

async function removeCategory() {
  if (!confirm('Delete this category?')) return
  const ok = await categories.remove(Number(props.id))
  if (ok) router.push('/categories')
}
</script>

<template>
  <section v-if="category" class="panel">
    <div class="toolbar">
      <h1>{{ category.name }}</h1>
      <div class="toolbar">
        <RouterLink v-if="auth.canWrite" class="button secondary" :to="`/categories/${category.id}/edit`">Edit</RouterLink>
        <button v-if="auth.canWrite" class="secondary" type="button" @click="removeCategory">Delete</button>
      </div>
    </div>
    <p>{{ category.description || 'No description' }}</p>
    <RouterLink to="/categories">← Back to categories</RouterLink>
  </section>
</template>
