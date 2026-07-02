import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/planner'
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
    path: '/calendar',
    name: 'calendar',
    component: () => import('../../features/calendar/CalendarView.vue'),
    meta: { layout: 'default' }
  },
  {
    path: '/statistics',
    name: 'statistics',
    component: () => import('../../features/statistics/StatisticsView.vue'),
    meta: { layout: 'default' }
  },
  {
    path: '/planner',
    name: 'planner',
    component: () => import('../../features/planner/PlannerView.vue'),
    meta: { layout: 'default' }
  },
  {
    path: '/planner/new',
    name: 'new-task',
    component: () => import('../../features/planner/TaskFormView.vue'),
    meta: { layout: 'blank' } // Importante: Usa el layout en blanco
  },
  {
    path: '/habits',
    name: 'habits',
    component: () => import('../../features/habits/HabitsView.vue'),
    meta: { layout: 'default' }
  },
  // Añade esta nueva ruta:
  {
    path: '/habits/new',
    name: 'new-habit',
    component: () => import('../../features/habits/HabitFormView.vue'),
    meta: { layout: 'blank' } // Layout sin barra inferior
  },
  {
    path: '/settings',
    name: 'settings',
    component: () => import('../../features/settings/SettingsView.vue'),
    meta: { layout: 'blank' } // Layout limpio sin barra de navegación
  },
  {
  path: '/habits/:id/edit',
  name: 'edit-habit',
  component: () => import("../../features/habits/EditHabitFormView.vue"),
  props: true
}
]

export const router = createRouter({
  history: createWebHistory(),
  routes
})