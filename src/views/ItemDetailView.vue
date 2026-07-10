<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useItemsStore } from '../stores/items'
import type { Item } from '../api/types'

const props = defineProps<{ id: string }>()
const router = useRouter()
const auth = useAuthStore()
const items = useItemsStore()
const item = ref<Item | null>(null)
const error = ref<string | null>(null)

onMounted(async () => {
  try {
    item.value = await items.getById(Number(props.id))
  } catch (e) {
    error.value = String(e)
  }
})

async function removeItem() {
  if (!confirm('Delete this item?')) return
  const ok = await items.remove(Number(props.id))
  if (ok) router.push('/items')
}
</script>

<template>
  <section v-if="item" class="panel">
    <div class="toolbar">
      <h1>{{ item.name }}</h1>
      <div class="toolbar">
        <RouterLink v-if="auth.canWrite" class="button secondary" :to="`/items/${item.id}/edit`">Edit</RouterLink>
        <button v-if="auth.canWrite" class="secondary" type="button" @click="removeItem">Delete</button>
      </div>
    </div>
    <p><strong>Price:</strong> ${{ item.price.toFixed(2) }}</p>
    <p><strong>Category:</strong> {{ item.category?.name ?? 'Uncategorized' }}</p>
    <p><strong>Description:</strong> {{ item.description || '—' }}</p>
    <RouterLink to="/items">← Back to items</RouterLink>
  </section>
  <p v-else-if="error" class="error">{{ error }}</p>
  <p v-else>Loading…</p>
</template>
