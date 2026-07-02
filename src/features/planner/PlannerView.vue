<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import dayjs from 'dayjs'
import 'dayjs/locale/es' 
import { usePlannerStore } from '../../app/stores/planner'
import TimelineItem from './components/TimelineItem.vue' // <--- Aquí importamos el componente

dayjs.locale('es')

const store = usePlannerStore()
const { selectedDate, dailyItems } = storeToRefs(store)
const isToday = (date: string) => date === dayjs().format('YYYY-MM-DD')

const displayItems = computed(() => dailyItems.value.filter(i => i.habitId))

const displayDate = computed(() => {
  return dayjs(selectedDate.value).format('dddd, D [de] MMMM')
})

const hours = Array.from({ length: 24 }, (_, i) => i)

const formatHour = (h: number) => {
  if (h === 0) return '12 AM'
  if (h < 12) return `${h} AM`
  if (h === 12) return '12 PM'
  return `${h - 12} PM`
}
</script>

<template>
  <div class="flex flex-col h-full bg-white dark:bg-black relative">
    
    <header class="sticky top-0 z-20 flex items-center justify-between px-4 py-4 bg-white/80 dark:bg-black /80 backdrop-blur-md border-b border-slate-100 dark:border-slate-800">
      <button @click="store.prevDay()" class="p-2 text-slate-500 active:bg-slate-100 rounded-full dark:active:bg-slate-800 transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
      </button>

      <h1 class="text-lg font-semibold text-slate-800 dark:text-slate-100 capitalize">
        {{ displayDate }}
      </h1>

      <div class="flex items-center gap-1">
        <button @click="store.nextDay()" class="p-2 text-slate-500 active:bg-slate-100 rounded-full dark:active:bg-slate-800 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
        </button>
        
        <router-link to="/settings" class="p-2 text-slate-500 active:bg-slate-100 rounded-full dark:active:bg-slate-800 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
        </router-link>
      </div>
    </header>

    <div class="flex-1 overflow-y-auto relative pb-24">
      <div class="relative w-full">
        <div 
          v-for="hour in hours" 
          :key="hour" 
          class="flex w-full border-b border-slate-100 dark:border-slate-800/50"
          style="height: 60px;" 
        >
          <div class="w-16 flex-shrink-0 text-right pr-3 -translate-y-3">
            <span class="text-xs font-medium text-slate-400 dark:text-slate-500">
              {{ formatHour(hour) }}
            </span>
          </div>
          <div class="flex-1 relative"></div>
        </div>

        <TimelineItem 
    v-for="item in displayItems" 
    :key="item.id" 
    :item="item"
    :class="[!isToday(item.date) ? 'opacity-50 pointer-events-none' : '']"
  />
      </div>
    </div>

    <router-link 
      to="/planner/new"
      class="absolute bottom-6 right-6 w-14 h-14 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white rounded-2xl shadow-lg flex items-center justify-center transition-all z-30"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
    </router-link>
  </div>
</template>