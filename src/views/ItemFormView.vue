<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useCategoriesStore } from '../stores/categories'
import { useItemsStore } from '../stores/items'

const props = defineProps<{ id?: string }>()
const router = useRouter()
const categories = useCategoriesStore()
const items = useItemsStore()

const name = ref('')
const price = ref('')
const description = ref('')
const categoryId = ref<number | ''>('')
const isEdit = ref(false)

onMounted(async () => {
  await categories.refresh()
  if (props.id) {
    isEdit.value = true
    const item = await items.getById(Number(props.id))
    name.value = item.name
    price.value = String(item.price)
    description.value = item.description ?? ''
    categoryId.value = item.category_id ?? ''
  }
})

async function submit() {
  const body = {
    name: name.value.trim(),
    price: Number(price.value),
    description: description.value.trim() || null,
    category_id: categoryId.value === '' ? null : Number(categoryId.value),
  }
  const result = isEdit.value
    ? await items.update(Number(props.id), body)
    : await items.create(body)
  if (result) router.push(isEdit.value ? `/items/${props.id}` : '/items')
}
</script>

<template>
  <section class="panel">
    <h1>{{ isEdit ? 'Edit item' : 'Create item' }}</h1>
    <form @submit.prevent="submit">
      <label class="field">
        <span>Name</span>
        <input v-model="name" required />
      </label>
      <label class="field">
        <span>Price</span>
        <input v-model="price" type="number" min="0.01" step="0.01" required />
      </label>
      <label class="field">
        <span>Category</span>
        <select v-model="categoryId">
          <option value="">Uncategorized</option>
          <option v-for="category in categories.categories" :key="category.id" :value="category.id">
            {{ category.name }}
          </option>
        </select>
      </label>
      <label class="field">
        <span>Description</span>
        <textarea v-model="description" rows="3" />
      </label>
      <button type="submit">{{ isEdit ? 'Save' : 'Create' }}</button>
    </form>
  </section>
</template>
