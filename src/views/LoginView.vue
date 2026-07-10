<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const auth = useAuthStore()
const router = useRouter()
const email = ref('')
const password = ref('')
const registerMode = ref(false)

async function submit() {
  const ok = registerMode.value
    ? await auth.register(email.value.trim(), password.value)
    : await auth.login(email.value.trim(), password.value)
  if (ok) router.push('/items')
}
</script>

<template>
  <section class="panel">
    <h1>{{ registerMode ? 'Register' : 'Sign in' }}</h1>
    <p>JWT auth for write endpoints. Reads work without signing in.</p>
    <form @submit.prevent="submit">
      <label class="field">
        <span>Email</span>
        <input v-model="email" type="email" required />
      </label>
      <label class="field">
        <span>Password</span>
        <input v-model="password" type="password" minlength="8" required />
      </label>
      <button type="submit" :disabled="auth.loading">{{ registerMode ? 'Create account' : 'Sign in' }}</button>
    </form>
    <button class="linkish" type="button" @click="registerMode = !registerMode">
      {{ registerMode ? 'Already have an account? Sign in' : 'Need an account? Register' }}
    </button>
    <p v-if="auth.error" class="error">{{ auth.error }}</p>
  </section>
</template>
