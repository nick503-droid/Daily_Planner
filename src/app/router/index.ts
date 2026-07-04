import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { hasStoredLocale } from '../../shared/i18n'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/planner'
  },
  {
    path: '/language',
    name: 'language',
    component: () => import('../../features/language/LanguageSelectView.vue'),
    meta: { layout: 'blank' }
  },
  {
    path: '/planner',
    name: 'planner',
    component: () => import('../../features/planner/PlannerView.vue'),
    meta: { layout: 'default' }
  },
  {
    path: '/habits',
    name: 'habits',
    component: () => import('../../features/habits/HabitsView.vue'),
    meta: { layout: 'default' }
  },
  {
    path: '/habits/new',
    name: 'new-habit',
    component: () => import('../../features/habits/HabitFormView.vue'),
    meta: { layout: 'blank' }
  },
  {
    path: '/habits/:id/edit',
    name: 'edit-habit',
    component: () => import("../../features/habits/EditHabitFormView.vue"),
    props: true
  },
  {
    path: '/statistics',
    name: 'statistics',
    component: () => import('../../features/statistics/StatisticsView.vue'),
    meta: { layout: 'default' }
  },
  {
    path: '/settings',
    name: 'settings',
    component: () => import('../../features/settings/SettingsView.vue'),
    meta: { layout: 'blank' }
  }
]

export const router = createRouter({
  history: createWebHistory(),
  routes
})

// Primer arranque: si el usuario nunca eligió idioma, lo mandamos a elegirlo antes que nada.
router.beforeEach((to) => {
  if (!hasStoredLocale() && to.name !== 'language') return { name: 'language' }
})
