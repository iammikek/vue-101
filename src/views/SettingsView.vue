<script setup lang="ts">
import { useAuthStore } from '../stores/auth'
import { useConfigStore } from '../stores/config'

const config = useConfigStore()
const auth = useAuthStore()

function onMockToggle(event: Event) {
  const checked = (event.target as HTMLInputElement).checked
  config.setUseMock(checked)
  config.rebuildClient(auth.accessToken)
}
</script>

<template>
  <section class="panel">
    <h1>Settings</h1>
    <label class="field">
      <span>Use mock data</span>
      <input type="checkbox" :checked="config.useMock" @change="onMockToggle" />
    </label>
    <label class="field">
      <span>Base URL</span>
      <input v-model="config.baseUrl" />
    </label>
    <p v-if="auth.isAuthenticated">Signed in as {{ auth.user?.email }}</p>
    <p v-else>Not signed in</p>
  </section>
</template>
