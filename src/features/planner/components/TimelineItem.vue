<script setup lang="ts">
import { computed } from 'vue'
import dayjs from 'dayjs'
import { usePlannerStore } from '../../../app/stores/planner'
import { formatTime12h } from '../../../shared/utils/time'

const props = defineProps<{
  item: any
}>()

const store = usePlannerStore()
const isToday = computed(() => props.item.date === dayjs().format('YYYY-MM-DD'))
</script>

<template>
  <component 
    :is="isToday ? 'router-link' : 'div'"
    :to="isToday ? `/habits/${item.habitId}/edit` : undefined"
    class="rounded-2xl shadow-sm border flex items-center justify-between p-3 transition-all duration-200 bg-white dark:bg-[#16213e] border-slate-100 dark:border-slate-700/40 border-l-4 overflow-hidden"
    :style="{ borderLeftColor: item.color || '#3b82f6' }"
    :class="[!isToday ? 'opacity-50' : 'active:scale-[0.99] cursor-pointer hover:shadow-md']"
  >
    <div class="flex flex-col min-w-0">
      <span 
        class="text-sm font-semibold truncate"
        :class="item.isCompleted ? 'text-slate-400 dark:text-slate-500 line-through' : 'text-slate-700 dark:text-slate-200'"
      >
        {{ item.title }}
      </span>
      <span class="text-[11px] font-medium text-slate-400 dark:text-slate-400 mt-0.5 truncate">
        {{ formatTime12h(item.startTime) }} - {{ formatTime12h(item.endTime) || formatTime12h('08:30') }}
      </span>
    </div>

    <div 
      @click.prevent.stop="store.toggleItemCompletion(item)"
      class="w-6 h-6 rounded-full border flex-shrink-0 flex items-center justify-center transition-all duration-300 ml-2"
      :class="item.isCompleted 
        ? 'bg-emerald-500 border-emerald-500 text-white' 
        : 'border-slate-200 dark:border-slate-600 bg-transparent'"
    >
      <svg v-if="item.isCompleted" xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
    </div>
  </component>
</template>