<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { db } from '../../shared/database/db'
import { scheduleHabitNotifications, cancelHabitNotifications } from '../../shared/notifications/habitNotifications'
import { usePlannerStore } from '../../app/stores/planner'

const route = useRoute()
const router = useRouter()
const { t } = useI18n()
const plannerStore = usePlannerStore()
const habitId = Number(route.params.id)

// Estado del formulario
const name = ref('')
const color = ref('#3b82f6')
const startTime = ref('08:00')
const endTime = ref('09:00')

const colorPalette = [
  '#EF4444', '#F97316', '#EAB308', '#22C55E', '#3B82F6', '#A855F7', '#EC4899'
]

onMounted(async () => {
  const habit = await db.habits.get(habitId)
  if (habit) {
    name.value = habit.name
    color.value = habit.color || '#3b82f6'
    // Asignamos con fallback si no existen
    startTime.value = habit.startTime || '08:00'
    endTime.value = habit.endTime || '09:00'
  }
})

const updateHabit = async () => {
  if (!name.value) return
  
  await db.habits.update(habitId, {
    name: name.value,
    color: color.value,
    startTime: startTime.value,
    endTime: endTime.value
  })

  // Si este hábito ya tenía tareas materializadas en el planner, reprogramamos sus
  // notificaciones con el nombre/horario nuevo (simplificación: reabre una ventana de
  // 30 días desde hoy, no intenta alinearse con las fechas exactas ya creadas).
  await cancelHabitNotifications(habitId)
  const wasScheduled = await db.plannerItems.where({ habitId }).count()
  if (wasScheduled > 0) {
    await scheduleHabitNotifications(habitId, t('notifications.habitSoon', { name: name.value }), startTime.value)
  }

  // Refrescamos el planner para que el cambio de nombre/color/hora se vea
  // de inmediato en la línea de tiempo, sin tener que cambiar de día.
  await plannerStore.loadItemsForSelectedDate()

  router.push('/habits')
}

const deleteHabit = async () => {
  if (confirm(t('editHabit.confirmDelete'))) {
    await cancelHabitNotifications(habitId)
    await db.habits.delete(habitId)
    await db.habitHistory.where({ habitId }).delete()
    // La limpieza de los plannerItems huérfanos ya la hace loadItemsForSelectedDate
    // (borra cualquier item cuyo habitId ya no exista en la tabla maestra).
    await plannerStore.loadItemsForSelectedDate()
    router.push('/habits')
  }
}
</script>

<template>
  <div class="w-full max-w-md mx-auto h-screen shadow-2xl bg-white dark:bg-[#1a1a2e] overflow-hidden flex flex-col">
    <header class="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-700/30">
      <button @click="router.back()" class="text-slate-500 font-medium">{{ t('editHabit.cancel') }}</button>
      <h1 class="font-bold text-slate-800 dark:text-slate-100">{{ t('editHabit.title') }}</h1>
      <button @click="updateHabit" class="text-blue-600 font-bold">{{ t('editHabit.save') }}</button>
    </header>

    <main class="p-6 space-y-8 flex-1 overflow-y-auto">
      <div>
        <label class="block text-sm font-medium text-slate-500 mb-2">{{ t('editHabit.name') }}</label>
        <input 
          v-model="name" 
          type="text" 
          class="w-full p-4 bg-slate-100 dark:bg-[#16213e] rounded-2xl border border-transparent focus:border-blue-500 outline-none text-slate-800 dark:text-white"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-slate-500 mb-4">{{ t('editHabit.color') }}</label>
        <div class="flex flex-wrap gap-4">
          <button 
            v-for="c in colorPalette" 
            :key="c"
            @click="color = c"
            type="button"
            class="w-9.5 h-10 rounded-full transition-all duration-200 outline-none"
            :class="color === c ? 'ring-4 ring-blue-500/30 scale-110' : 'hover:scale-105'"
            :style="{ backgroundColor: c }"
          >
            <div v-if="color === c" class="w-full h-full rounded-full border-4 border-white dark:border-[#1a1a2e]"></div>
          </button>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-slate-500 mb-2">{{ t('editHabit.start') }}</label>
          <input 
            v-model="startTime" 
            type="time" 
            class="w-full h-14 px-4 bg-slate-100 dark:bg-[#16213e] rounded-2xl border border-transparent text-slate-800 dark:text-white outline-none"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-slate-500 mb-2">{{ t('editHabit.end') }}</label>
          <input 
            v-model="endTime" 
            type="time" 
            class="w-full h-14 px-4 bg-slate-100 dark:bg-[#16213e] rounded-2xl border border-transparent text-slate-800 dark:text-white outline-none"
          />
        </div>
      </div>

      <button 
        @click="deleteHabit" 
        class="w-full p-4 bg-rose-500/10 text-rose-500 rounded-2xl font-bold mt-4 active:scale-95 transition-transform"
      >
        {{ t('editHabit.delete') }}
      </button>
    </main>
  </div>
</template>