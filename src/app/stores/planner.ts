import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import dayjs from 'dayjs'
import { db } from '../../shared/database/db'
import type { PlannerItem } from '../../shared/types/database'

export const usePlannerStore = defineStore('planner', () => {
  const selectedDate = ref(dayjs().format('YYYY-MM-DD'))
  const dailyItems = ref<any[]>([])
  const isLoading = ref(false)

  const loadItemsForSelectedDate = async () => {
    isLoading.value = true
    try {
      // 1. Traer hábitos master actuales
      const habits = await db.habits.toArray()
      const habitsMap = new Map(habits.map(h => [h.id, h]))

      // 2. Traer los registros que existen en el planner para este día
      const items = await db.plannerItems
        .where('date')
        .equals(selectedDate.value)
        .toArray()

      // 3. Limpieza: Si hay un ítem de hábito que ya no existe en la DB maestra, lo borramos
      for (const item of items) {
        if (item.habitId && !habitsMap.has(item.habitId)) {
          await db.plannerItems.delete(item.id!)
        }
      }

      // 4. Volver a consultar tras la limpieza
      const validItems = await db.plannerItems
        .where('date')
        .equals(selectedDate.value)
        .toArray()

      // 5. Sincronizar en memoria con los datos frescos de la tabla Habits (Color y Hora)
      dailyItems.value = validItems.map(item => {
        if (item.habitId) {
          const habit = habitsMap.get(item.habitId)
          if (habit) {
            item.startTime = habit.startTime || item.startTime
            item.endTime = habit.endTime || item.endTime
            item.title = habit.name
            item.color = habit.color
          }
        }
        return item
      }).sort((a, b) => a.startTime.localeCompare(b.startTime))

    } catch (error) {
      console.error('Error cargando el planificador:', error)
    } finally {
      isLoading.value = false
    }
  }

  const nextDay = () => selectedDate.value = dayjs(selectedDate.value).add(1, 'day').format('YYYY-MM-DD')
  const prevDay = () => selectedDate.value = dayjs(selectedDate.value).subtract(1, 'day').format('YYYY-MM-DD')
  const setDate = (dateString: string) => selectedDate.value = dayjs(dateString).format('YYYY-MM-DD')

  const toggleItemCompletion = async (item: PlannerItem) => {
    if (!item.id) return
    const newState = !item.isCompleted
    
    try {
      await db.plannerItems.update(item.id, { isCompleted: newState })
      const index = dailyItems.value.findIndex(i => i.id === item.id)
      if (index !== -1) dailyItems.value[index].isCompleted = newState

      if (item.habitId) {
        const today = selectedDate.value
        const existingLog = await db.habitHistory.where({ habitId: item.habitId, date: today }).first()
        if (existingLog) {
          await db.habitHistory.update(existingLog.id!, { status: newState ? 'completed' : 'missed' })
        } else {
          await db.habitHistory.add({ habitId: item.habitId, date: today, status: newState ? 'completed' : 'missed' })
        }
      }
    } catch (error) {
      console.error('Error al actualizar item:', error)
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