<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import dayjs from 'dayjs'
import 'dayjs/locale/es'
import { usePlannerStore } from '../../app/stores/planner'

dayjs.locale('es')

const router = useRouter()
const store = usePlannerStore()

const currentMonth = ref(dayjs(store.selectedDate).startOf('month'))
const weekDays = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']

const calendarDays = computed(() => {
  const year = currentMonth.value.year()
  const month = currentMonth.value.month()
  
  const firstDayOfMonth = dayjs(new Date(year, month, 1))
  const daysInMonth = firstDayOfMonth.daysInMonth()
  
  let startingDayOfWeek: number = firstDayOfMonth.day()
  startingDayOfWeek = startingDayOfWeek === 0 ? 6 : startingDayOfWeek - 1

  const days = []
  
  for (let i = 0; i < startingDayOfWeek; i++) {
    days.push({ id: `empty-${i}`, isCurrentMonth: false })
  }

  for (let i = 1; i <= daysInMonth; i++) {
    const dateStr = dayjs(new Date(year, month, i)).format('YYYY-MM-DD')
    days.push({
      id: dateStr,
      date: dateStr,
      dayNumber: i,
      isCurrentMonth: true,
      isToday: dateStr === dayjs().format('YYYY-MM-DD'),
      isSelected: dateStr === store.selectedDate
    })
  }

  return days
})

const nextMonth = () => currentMonth.value = currentMonth.value.add(1, 'month')
const prevMonth = () => currentMonth.value = currentMonth.value.subtract(1, 'month')
const goToToday = () => currentMonth.value = dayjs().startOf('month')

const selectDateAndGoToPlanner = (dateStr: string) => {
  store.setDate(dateStr)
  router.push('/planner')
}
</script>

<template>
  <div class="flex flex-col h-full bg-slate-50 dark:bg-black relative">
    <header class="px-4 py-6 bg-white dark:bg-black border-b border-slate-200 dark:border-slate-800">
      <h1 class="text-2xl font-bold text-slate-800 dark:text-slate-100">Calendario</h1>
    </header>

    <div class="flex-1 p-4 overflow-y-auto pb-24">
      <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 p-4">
        
        <div class="flex items-center justify-between mb-6">
          <button @click="prevMonth" class="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          </button>
          
          <h2 class="text-lg font-bold text-slate-800 dark:text-slate-100 capitalize cursor-pointer" @click="goToToday">
            {{ currentMonth.format('MMMM YYYY') }}
          </h2>
          
          <button @click="nextMonth" class="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
          </button>
        </div>

        <div class="grid grid-cols-7 mb-2">
          <div v-for="day in weekDays" :key="day" class="text-center text-xs font-semibold text-slate-400 uppercase">
            {{ day }}
          </div>
        </div>

        <div class="grid grid-cols-7 gap-1">
          <div v-for="day in calendarDays" :key="day.id" class="aspect-square flex flex-col items-center justify-center p-1">
            <button 
              v-if="day.isCurrentMonth"
              @click="selectDateAndGoToPlanner(day.date!)"
              class="w-full h-full flex items-center justify-center rounded-full text-sm font-medium transition-all"
              :class="[
                day.isSelected 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : day.isToday 
                    ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 font-bold' 
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 active:scale-95'
              ]"
            >
              {{ day.dayNumber }}
            </button>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>