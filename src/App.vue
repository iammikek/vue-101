<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { useAuthStore } from './stores/auth'
import { useConfigStore } from './stores/config'

const auth = useAuthStore()
const config = useConfigStore()
</script>

<template>
  <div class="app">
    <header class="topbar">
      <div>
        <strong>*-101 Vue Client</strong>
        <span class="badge">{{ config.useMock ? 'Mock' : 'Live' }}</span>
      </div>
      <nav class="nav">
        <RouterLink to="/items">Items</RouterLink>
        <RouterLink to="/categories">Categories</RouterLink>
        <RouterLink to="/stats">Stats</RouterLink>
        <RouterLink to="/settings">Settings</RouterLink>
        <RouterLink v-if="!auth.isAuthenticated" to="/login">Sign in</RouterLink>
        <button v-else class="linkish" type="button" @click="auth.logout()">Sign out</button>
      </nav>
    </header>

    <main class="main">
      <RouterView />
    </main>
  </div>
</template>
