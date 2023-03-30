import { createRouter, createWebHistory } from 'vue-router'
import AuthView from '../views/AuthView.vue'
import ErrorView from '../views/ErrorView.vue'
import PanelView from '../views/PanelView.vue'
import SettingsView from '../views/SettingsView.vue'

const routes = [
  {
    path: '/',
    name: 'auth',
    component: AuthView
  },
  {
    path: '/error',
    name: 'error',
    component: ErrorView
  },
  {
    path: '/panel',
    name: 'panel',
    component: PanelView
  },
  {
    path: '/settings',
    name: 'settings',
    component: SettingsView
  },
  {
    path: "/:catchAll(.*)",
    name: '404',
    component: () => import('../views/404View.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
