<script setup lang="ts">
import { onMounted } from 'vue'
import { useItemsStore } from '../stores/items'

const items = useItemsStore()

onMounted(() => items.loadStats())
</script>

<template>
  <section>
    <h1>Item stats</h1>
    <div v-if="items.stats" class="metrics">
      <div class="metric"><strong>Total</strong><div>{{ items.stats.total_items }}</div></div>
      <div class="metric"><strong>Average</strong><div>${{ items.stats.average_price.toFixed(2) }}</div></div>
      <div class="metric"><strong>Min</strong><div>{{ items.stats.min_price == null ? '—' : `$${items.stats.min_price.toFixed(2)}` }}</div></div>
      <div class="metric"><strong>Max</strong><div>{{ items.stats.max_price == null ? '—' : `$${items.stats.max_price.toFixed(2)}` }}</div></div>
      <div class="metric"><strong>Uncategorized</strong><div>{{ items.stats.uncategorized_count }}</div></div>
    </div>
    <div v-if="items.stats?.by_category.length" class="panel" style="margin-top: 1rem">
      <h2>By category</h2>
      <ul class="list">
        <li v-for="row in items.stats.by_category" :key="row.category_id">
          <span>{{ row.category_name }} ({{ row.item_count }})</span>
          <span>${{ row.average_price.toFixed(2) }} avg</span>
        </li>
      </ul>
    </div>
  </section>
</template>
