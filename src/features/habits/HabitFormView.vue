<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import dayjs from 'dayjs'
import { db } from '../../shared/database/db'
import { scheduleHabitNotifications } from '../../shared/notifications/habitNotifications'
import { usePlannerStore } from '../../app/stores/planner'
import { Activity, Book, Dumbbell, Heart, Coffee, Droplets } from 'lucide-vue-next'

const router = useRouter()
const { t } = useI18n()
const plannerStore = usePlannerStore()

// Estado del Hábito
const name = ref('')
const selectedColor = ref('#3b82f6')
const selectedIcon = ref('Activity')

// Estado de Programación en el Planner
const scheduleAutomatically = ref(false)
const startTime = ref('08:00')
const endTime = ref('09:00')

const palette = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#a855f7', '#ec4899']
const icons = [
  { id: 'Activity', component: Activity },
  { id: 'Book', component: Book },
  { id: 'Dumbbell', component: Dumbbell },
  { id: 'Heart', component: Heart },
  { id: 'Coffee', component: Coffee },
  { id: 'Droplets', component: Droplets }
]

const saveHabit = async () => {
  if (!name.value) {
    alert(t('habitForm.nameRequired'))
    return
  }

  try {
    // 1. Guardamos el hábito principal
    // IMPORTANTE: guardamos también startTime/endTime en el hábito maestro
    // (aunque no se programe automáticamente) para que la pantalla de edición
    // siempre pueda precargar la hora real elegida, en vez de caer al
    // fallback de las 08:00 y "cambiar" la hora sin que el usuario lo pidiera.
    const habitId = await db.habits.add({
      name: name.value,
      color: selectedColor.value,
      icon: selectedIcon.value,
      createdAt: dayjs().format('YYYY-MM-DD'),
      startTime: scheduleAutomatically.value ? startTime.value : undefined,
      endTime: scheduleAutomatically.value ? endTime.value : undefined,
      currentStreak: 0,
      bestStreak: 0,
      totalCompletedDays: 0,
      totalMissedDays: 0
    })

    // 2. LA MAGIA: Si el usuario quiere programarlo, materializamos 30 días de tareas
    if (scheduleAutomatically.value) {
      const futureTasks = []
      
      // Bucle para los próximos 30 días (empezando desde hoy)
      for (let i = 0; i < 30; i++) {
        const targetDate = dayjs().add(i, 'day').format('YYYY-MM-DD')
        
        futureTasks.push({
          id: crypto.randomUUID(),
          date: targetDate,
          startTime: startTime.value,
          endTime: endTime.value,
          title: name.value, // Toma el mismo nombre del hábito
          isCompleted: false,
          habitId: habitId // ¡Crucial! Esto vincula la tarea con el hábito
        })
      }

      // Insertamos los 30 registros de golpe (bulkAdd es ultra rápido)
      await db.plannerItems.bulkAdd(futureTasks)

      // Notificación local 10 min antes de cada ocurrencia (pide permiso si hace falta).
      await scheduleHabitNotifications(
        habitId,
        t('notifications.habitSoon', { name: name.value }),
        startTime.value
      )
    }

    // Refrescamos el planner AHORA, en memoria, para que si el usuario
    // vuelve a la vista de las 24 horas los nuevos bloques ya estén ahí sin
    // tener que cambiar de día para "forzar" la recarga.
    await plannerStore.loadItemsForSelectedDate()

    router.back()
  } catch (error) {
    console.error('Error guardando el hábito:', error)
  }
}
</script>

<template>
  <div class="flex flex-col h-screen bg-slate-50 dark:bg-black z-50">
    
    <header class="flex items-center justify-between px-4 py-4 bg-white dark:bg-black border-b border-slate-200 dark:border-slate-800">
      <button @click="router.back()" class="text-slate-500 font-medium active:opacity-70">{{ t('habitForm.cancel') }}</button>
      <h1 class="text-lg font-bold">{{ t('habitForm.newTitle') }}</h1>
      <button @click="saveHabit" class="text-blue-600 dark:text-blue-400 font-bold active:opacity-70">{{ t('habitForm.create') }}</button>
    </header>

    <main class="flex-1 p-4 overflow-y-auto space-y-6 pb-24">
      
      <!-- Entrada de Nombre -->
      <div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-4">
        <label class="block text-xs font-semibold text-slate-500 uppercase mb-2">{{ t('habitForm.nameLabel') }}</label>
        <input 
          v-model="name" 
          type="text" 
          :placeholder="t('habitForm.namePlaceholder')"
          class="w-full text-lg border-b border-slate-200 dark:border-slate-700 bg-transparent py-2 focus:outline-none focus:border-blue-500"
        >
      </div>

      <!-- UX: Toggle para programar en el Planner -->
      <div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-4">
        <div class="flex items-center justify-between" @click="scheduleAutomatically = !scheduleAutomatically">
          <div>
            <h3 class="font-semibold text-slate-800 dark:text-slate-100">{{ t('habitForm.scheduleTitle') }}</h3>
            <p class="text-xs text-slate-500">{{ t('habitForm.scheduleSubtitle') }}</p>
          </div>
          
          <!-- Toggle Switch UI -->
          <div 
            class="w-12 h-6 rounded-full p-1 transition-colors duration-300 ease-in-out cursor-pointer"
            :class="scheduleAutomatically ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-600'"
          >
            <div 
              class="w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-300"
              :class="scheduleAutomatically ? 'translate-x-6' : 'translate-x-0'"
            ></div>
          </div>
        </div>

        <!-- Aparece solo si el toggle está activo -->
        <div v-if="scheduleAutomatically" class="flex gap-4 mt-4 pt-4 border-t border-slate-100 dark:border-slate-700">
          <div class="flex-1">
            <label class="block text-xs font-semibold text-slate-500 uppercase mb-1">{{ t('habitForm.start') }}</label>
            <input 
              v-model="startTime" 
              type="time" 
              class="w-full bg-slate-100 dark:bg-black rounded-lg p-3 text-center font-medium focus:outline-none"
            >
          </div>
          <div class="flex-1">
            <label class="block text-xs font-semibold text-slate-500 uppercase mb-1">{{ t('habitForm.end') }}</label>
            <input 
              v-model="endTime" 
              type="time" 
              class="w-full bg-slate-100 dark:bg-black rounded-lg p-3 text-center font-medium focus:outline-none"
            >
          </div>
        </div>
      </div>

      <!-- Selector de Color -->
      <div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-4">
        <label class="block text-xs font-semibold text-slate-500 uppercase mb-3">{{ t('habitForm.color') }}</label>
        <div class="flex justify-between">
          <button 
            v-for="color in palette" 
            :key="color"
            @click="selectedColor = color"
            class="w-10 h-10 rounded-full transition-transform"
            :class="selectedColor === color ? 'scale-110 ring-4 ring-slate-200 dark:ring-slate-700' : 'scale-100'"
            :style="{ backgroundColor: color }"
          ></button>
        </div>
      </div>

      <!-- Selector de Ícono -->
      <div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-4">
        <label class="block text-xs font-semibold text-slate-500 uppercase mb-3">{{ t('habitForm.icon') }}</label>
        <div class="grid grid-cols-6 gap-4">
          <button 
            v-for="icon in icons" 
            :key="icon.id"
            @click="selectedIcon = icon.id"
            class="flex items-center justify-center p-3 rounded-xl transition-all"
            :class="selectedIcon === icon.id ? 'bg-slate-100 dark:bg-slate-700 text-blue-600 dark:text-blue-400' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'"
          >
            <component :is="icon.component" :size="28" :stroke-width="selectedIcon === icon.id ? 2.5 : 2" />
          </button>
        </div>
      </div>

    </main>
  </div>
</template>