<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import dayjs from 'dayjs'
import { usePlannerStore } from '../../app/stores/planner'
import TimelineItem from './components/TimelineItem.vue'

const store = usePlannerStore()
const { selectedDate, dailyItems } = storeToRefs(store)

const displayDate = computed(() => dayjs(selectedDate.value).format('dddd, D [De] MMMM'))

const hours = Array.from({ length: 24 }, (_, i) => i)
const formatHour = (h: number) => {
  if (h === 0) return '12 AM'
  if (h < 12) return `${h} AM`
  if (h === 12) return '12 PM'
  return `${h - 12} PM`
}

// Agrupa los hábitos por la hora de inicio (parte entera).
// Ej: un hábito a las 8:30 cae en el grupo de la hora 8.
const itemsByHour = computed(() => {
  const map = new Map<number, any[]>()
  for (const item of dailyItems.value) {
    const [h] = (item.startTime || '08:00').split(':').map(Number)
    if (!map.has(h)) map.set(h, [])
    map.get(h)!.push(item)
  }
  return map
})
</script>

<template>
  <div class="w-full max-w-md mx-auto h-screen shadow-2xl bg-white dark:bg-[#1a1a2e] overflow-hidden flex flex-col relative">
    
    <header class="sticky top-0 z-20 flex items-center justify-between px-4 py-4 bg-white/80 dark:bg-[#1a1a2e]/90 backdrop-blur-md border-b border-slate-100 dark:border-slate-700/30">
      <button @click="store.prevDay()" class="p-2 text-slate-500 active:bg-slate-100 rounded-full dark:active:bg-slate-700/50 transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
      </button>

      <h1 class="text-base font-bold text-slate-800 dark:text-slate-100 capitalize">
        {{ displayDate }}
      </h1>

      <div class="flex items-center gap-1">
        <button @click="store.nextDay()" class="p-2 text-slate-500 active:bg-slate-100 rounded-full dark:active:bg-slate-700/50 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
        </button>
        
        <router-link to="/settings" class="p-2 text-slate-500 active:bg-slate-100 rounded-full dark:active:bg-slate-700/50 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
        </router-link>
      </div>
    </header>

    <div class="flex-1 overflow-y-auto relative pb-32 bg-slate-50/20 dark:bg-[#1a1a2e]">
      <div class="w-full">
        <div v-for="hour in hours" :key="hour" class="flex w-full border-b border-slate-100/80 dark:border-slate-700/20" :style="{ minHeight: '60px' }">
          <!-- Columna de la hora (fija a la izquierda) -->
          <div class="w-14 flex-shrink-0 text-right pr-3 pt-1">
            <span class="text-[10px] font-bold tracking-wider text-slate-400 dark:text-slate-600 uppercase">
              {{ formatHour(hour) }}
            </span>
          </div>
          <!-- Columna de contenido: los hábitos se apilan aquí en cascada vertical -->
          <div class="flex-1 flex flex-col gap-1.5 py-1 pr-4">
            <TimelineItem
              v-for="item in (itemsByHour.get(hour) || [])"
              :key="item.id"
              :item="item"
            />
          </div>
        </div>
      </div>
    </div>

    <router-link to="/habits/new" class="absolute bottom-24 right-6 w-14 h-14 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white rounded-2xl shadow-xl flex items-center justify-center transition-all z-30">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
    </router-link>
  </div>
</template>