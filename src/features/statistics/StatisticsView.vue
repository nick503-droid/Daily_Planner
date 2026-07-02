<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import dayjs from 'dayjs'
import isBetween from 'dayjs/plugin/isBetween'
import { db } from '../../shared/database/db'

dayjs.extend(isBetween)

const habitsData = ref<any[]>([])
const totalCompletions = computed(() => habitsData.value.reduce((acc, h) => acc + h.count, 0))

const loadData = async () => {
  // Rango de la semana actual (Lunes a Domingo)
  const startOfWeek = dayjs().startOf('week').format('YYYY-MM-DD')
  const endOfWeek = dayjs().endOf('week').format('YYYY-MM-DD')

  // 1. Obtenemos TODOS los logs de la semana (sin filtrar status en la DB para evitar el error)
  const allLogs = await db.habitHistory
    .where('date')
    .between(startOfWeek, endOfWeek, true, true)
    .toArray()

  // 2. Filtramos el status en JS (Es ultra rápido para local)
  const completedLogs = allLogs.filter(log => log.status === 'completed')
  const allHabits = await db.habits.toArray()

  habitsData.value = allHabits.map(h => {
    const completions = completedLogs.filter(log => log.habitId === h.id).length
    return {
      name: h.name,
      color: h.color,
      count: completions,
      percentage: completedLogs.length > 0 ? (completions / completedLogs.length) * 100 : 0
    }
  }).filter(h => h.count > 0) // Solo mostrar hábitos con actividad
}

// Lógica para dibujar el SVG Donut
const getDonutStyle = (index: number, percentage: number) => {
  const offset = habitsData.value.slice(0, index).reduce((acc, curr) => acc + curr.percentage, 0)
  return {
    strokeDasharray: `${percentage} ${100 - percentage}`,
    strokeDashoffset: -offset
  }
}

onMounted(loadData)
</script>

<template>
  <div class="w-full max-w-md mx-auto h-screen shadow-2xl bg-white dark:bg-[#050505] overflow-hidden flex flex-col">
    <header class="px-6 py-6 border-b border-slate-100 dark:border-slate-800/50">
      <h1 class="text-xl font-bold text-slate-800 dark:text-slate-100">Analítica de Vida</h1>
    </header>

    <main class="flex-1 p-6 flex flex-col items-center justify-center">
      
      <!-- Círculo Central (Donut Chart) -->
      <div class="relative flex justify-center items-center mb-10">
        <svg viewBox="0 0 36 36" class="w-64 h-64 rotate-[-90deg]">
          <!-- Círculo de fondo (Gris) -->
          <circle cx="18" cy="18" r="15.9" fill="none" class="stroke-slate-100 dark:stroke-slate-900" stroke-width="3"></circle>
          
          <!-- Segmentos de datos -->
          <circle 
            v-for="(h, i) in habitsData" 
            :key="h.name"
            cx="18" cy="18" r="15.9" 
            fill="none" 
            :stroke="h.color" 
            stroke-width="3"
            stroke-linecap="round"
            :style="getDonutStyle(i, h.percentage)"
            class="transition-all duration-500 ease-out"
          ></circle>
        </svg>
        
        <!-- Texto central -->
        <div class="absolute text-center">
          <p class="text-xs text-slate-400 uppercase tracking-widest font-semibold">Total</p>
          <p class="text-4xl font-bold text-slate-800 dark:text-white">{{ totalCompletions }}</p>
        </div>
      </div>

      <!-- Leyenda Simple -->
      <div class="w-full space-y-3">
        <div v-for="h in habitsData" :key="h.name" class="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl">
          <div class="flex items-center gap-3">
            <div class="w-3 h-3 rounded-full" :style="{ backgroundColor: h.color }"></div>
            <span class="font-medium text-slate-700 dark:text-slate-200">{{ h.name }}</span>
          </div>
          <span class="text-sm font-bold text-slate-500">{{ h.percentage.toFixed(0) }}%</span>
        </div>
      </div>

    </main>
  </div>
</template>