import { createRouter, createWebHistory } from 'vue-router'
import EnterView from '../views/EnterView.vue'
import AuthView from '../views/AuthView.vue'
import PanelView from '../views/PanelView.vue'
import SettingsView from '../views/SettingsView.vue'
import BoxView from '../views/BoxView.vue'
import ReportsView from '../views/ReportsView.vue'

const routes = [
  {
    path: '/',
    name: 'enter',
    component: EnterView,
    meta: { hideHeader: true },
  },
  {
    path: '/auth',
    name: 'auth',
    component: AuthView,
    meta: { hideHeader: true },
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
    path: '/box',
    name: 'box',
    component: BoxView
  },
  {
    path: '/reports',
    name: 'reports',
    component: ReportsView
  },
  {
    path: "/:catchAll(.*)",
    name: '404',
    component: () => import('../views/404View.vue'),
    meta: { hideHeader: true },
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
