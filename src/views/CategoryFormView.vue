<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useCategoriesStore } from '../stores/categories'

const props = defineProps<{ id?: string }>()
const router = useRouter()
const categories = useCategoriesStore()

const name = ref('')
const description = ref('')
const isEdit = ref(false)

onMounted(async () => {
  if (props.id) {
    isEdit.value = true
    const category = await categories.getById(Number(props.id))
    name.value = category.name
    description.value = category.description ?? ''
  }
})

async function submit() {
  const result = isEdit.value
    ? await categories.update(Number(props.id), name.value.trim(), description.value.trim() || null)
    : await categories.create(name.value.trim(), description.value.trim() || null)
  if (result) router.push(isEdit.value ? `/categories/${props.id}` : '/categories')
}
</script>

<template>
  <section class="panel">
    <h1>{{ isEdit ? 'Edit category' : 'Create category' }}</h1>
    <form @submit.prevent="submit">
      <label class="field">
        <span>Name</span>
        <input v-model="name" required />
      </label>
      <label class="field">
        <span>Description</span>
        <textarea v-model="description" rows="3" />
      </label>
      <button type="submit">{{ isEdit ? 'Save' : 'Create' }}</button>
    </form>
  </section>
</template>
