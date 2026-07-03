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
    path: '/planner/new',
    name: 'new-task',
    component: () => import('../../features/planner/TaskFormView.vue'),
    meta: { layout: 'blank' }
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