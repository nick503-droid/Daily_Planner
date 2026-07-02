import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import dayjs from 'dayjs'
import { db } from '../../shared/database/db'
import type { PlannerItem } from '../../shared/types/database'

export const usePlannerStore = defineStore('planner', () => {
  const selectedDate = ref(dayjs().format('YYYY-MM-DD'))
  const dailyItems = ref<PlannerItem[]>([])
  const isLoading = ref(false)

  const loadItemsForSelectedDate = async () => {
    isLoading.value = true
    try {
      dailyItems.value = await db.plannerItems
        .where('date')
        .equals(selectedDate.value)
        .sortBy('startTime')
    } catch (error) {
      console.error('Error cargando los ítems:', error)
    } finally {
      isLoading.value = false
    }
  }

  const nextDay = () => selectedDate.value = dayjs(selectedDate.value).add(1, 'day').format('YYYY-MM-DD')
  const prevDay = () => selectedDate.value = dayjs(selectedDate.value).subtract(1, 'day').format('YYYY-MM-DD')
  const setDate = (dateString: string) => selectedDate.value = dayjs(dateString).format('YYYY-MM-DD')

  // ----------------------------------------------------------------
  // ALGORITMO DE CÁLCULO DE RACHAS
  // ----------------------------------------------------------------
  const updateHabitHistoryAndStats = async (habitId: number, date: string, isCompleted: boolean) => {
    // 1. Registrar (Upsert) en el Historial del Hábito
    const existingLog = await db.habitHistory.where({ habitId, date }).first()
    if (existingLog) {
      await db.habitHistory.update(existingLog.id!, { status: isCompleted ? 'completed' : 'missed' })
    } else {
      await db.habitHistory.add({ habitId, date, status: isCompleted ? 'completed' : 'missed' })
    }

    // 2. Traer todo el historial completado de este hábito, ordenado por fecha
    const logs = await db.habitHistory
      .where('habitId').equals(habitId)
      .filter(log => log.status === 'completed')
      .sortBy('date')

    let tempStreak = 0
    let bestStreak = 0
    let previousDate: string | null = null

    // 3. Recorrer la historia para encontrar el récord máximo (bestStreak)
    for (const log of logs) {
      if (!previousDate) {
        tempStreak = 1
      } else {
        const diff = dayjs(log.date).diff(dayjs(previousDate), 'day')
        if (diff === 1) {
          tempStreak++ // Días consecutivos
        } else if (diff > 1) {
          tempStreak = 1 // Se rompió la racha, vuelve a 1
        }
      }
      if (tempStreak > bestStreak) bestStreak = tempStreak
      previousDate = log.date
    }

    // 4. Calcular la racha actual (solo es válida si completó hoy o ayer)
    let currentStreak = 0
    const today = dayjs().format('YYYY-MM-DD')
    const yesterday = dayjs().subtract(1, 'day').format('YYYY-MM-DD')

    if (logs.length > 0) {
      const lastLogDate = logs[logs.length - 1].date
      if (lastLogDate === today || lastLogDate === yesterday) {
        currentStreak = tempStreak // Mantiene la racha actual
      } else {
        currentStreak = 0 // Racha perdida por inactividad
      }
    }

    // 5. Guardar los contadores en la tabla principal del hábito
    await db.habits.update(habitId, {
      totalCompletedDays: logs.length,
      currentStreak,
      bestStreak
    })
  }

  // ----------------------------------------------------------------
  // TOGGLE DE TAREAS MEJORADO
  // ----------------------------------------------------------------
  const toggleItemCompletion = async (item: PlannerItem) => {
    if (!item.id) return
    const newState = !item.isCompleted
    
    try {
      // Actualizar visualmente y en base de datos local
      await db.plannerItems.update(item.id, { isCompleted: newState })
      const index = dailyItems.value.findIndex(i => i.id === item.id)
      if (index !== -1) dailyItems.value[index].isCompleted = newState

      // SI LA TAREA ES DE UN HÁBITO, ACTUALIZAR SUS ESTADÍSTICAS
      if (item.habitId) {
        await updateHabitHistoryAndStats(item.habitId, item.date, newState)
      }
    } catch (error) {
      console.error('Error al actualizar la tarea:', error)
    }
  }

  watch(selectedDate, () => { loadItemsForSelectedDate() }, { immediate: true })

  return {
    selectedDate,
    dailyItems,
    isLoading,
    loadItemsForSelectedDate,
    nextDay,
    prevDay,
    setDate,
    toggleItemCompletion
  }
})