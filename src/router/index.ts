import { createRouter, createWebHistory } from 'vue-router'
import ItemsView from '../views/ItemsView.vue'
import ItemDetailView from '../views/ItemDetailView.vue'
import ItemFormView from '../views/ItemFormView.vue'
import CategoriesView from '../views/CategoriesView.vue'
import CategoryDetailView from '../views/CategoryDetailView.vue'
import CategoryFormView from '../views/CategoryFormView.vue'
import StatsView from '../views/StatsView.vue'
import LoginView from '../views/LoginView.vue'
import SettingsView from '../views/SettingsView.vue'

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/items' },
    { path: '/items', name: 'items', component: ItemsView },
    { path: '/items/new', name: 'item-create', component: ItemFormView },
    { path: '/items/:id', name: 'item-detail', component: ItemDetailView, props: true },
    { path: '/items/:id/edit', name: 'item-edit', component: ItemFormView, props: true },
    { path: '/categories', name: 'categories', component: CategoriesView },
    { path: '/categories/new', name: 'category-create', component: CategoryFormView },
    { path: '/categories/:id', name: 'category-detail', component: CategoryDetailView, props: true },
    { path: '/categories/:id/edit', name: 'category-edit', component: CategoryFormView, props: true },
    { path: '/stats', name: 'stats', component: StatsView },
    { path: '/login', name: 'login', component: LoginView },
    { path: '/settings', name: 'settings', component: SettingsView },
  ],
})
