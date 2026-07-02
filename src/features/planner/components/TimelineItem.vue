<script setup lang="ts">
import { computed } from 'vue'
import type { PlannerItem } from '../../../shared/types/database'
import { usePlannerStore } from '../../../app/stores/planner' // <--- Importar

const props = defineProps<{
  item: PlannerItem
}>()

const store = usePlannerStore() // <--- Inicializar

const blockStyle = computed(() => {
  const [startHour, startMin] = props.item.startTime.split(':').map(Number)
  const [endHour, endMin] = props.item.endTime.split(':').map(Number)

  const startInMinutes = (startHour * 60) + startMin
  const endInMinutes = (endHour * 60) + endMin
  const duration = endInMinutes - startInMinutes

  return {
    top: `${startInMinutes}px`,
    height: `${duration}px`
  }
})
</script>

<template>
  <div 
    class="absolute left-16 right-4 rounded-lg p-2 shadow-sm border overflow-hidden transition-all active:scale-[0.98]"
    :class="[
      item.isCompleted 
        ? 'bg-slate-100 border-slate-200 opacity-60 dark:bg-slate-800 dark:border-slate-700' 
        : 'bg-blue-50 border-blue-200 dark:bg-blue-900/30 dark:border-blue-800'
    ]"
    :style="blockStyle"
  >
    <div class="flex items-start justify-between h-full">
      <div class="flex flex-col overflow-hidden">
        <span 
          class="text-sm font-semibold truncate transition-colors"
          :class="item.isCompleted ? 'text-slate-500 line-through' : 'text-blue-900 dark:text-blue-100'"
        >
          {{ item.title }}
        </span>
        
        <div v-if="parseInt(blockStyle.height) >= 45" class="mt-1 flex flex-col gap-1 transition-opacity" :class="item.isCompleted ? 'opacity-50' : ''">
          <span class="text-xs text-blue-600/80 dark:text-blue-300/80 font-medium">
            {{ item.startTime }} - {{ item.endTime }}
          </span>
          <p v-if="item.notes" class="text-xs truncate opacity-80" :class="item.isCompleted ? 'text-slate-500' : 'text-blue-800 dark:text-blue-200'">
            {{ item.notes }}
          </p>
        </div>
      </div>
      
      <!-- Checkbox: Añadimos cursor-pointer y el evento click -->
      <div 
        @click.stop="store.toggleItemCompletion(item)"
        class="w-6 h-6 rounded-full border-2 flex-shrink-0 flex items-center justify-center cursor-pointer transition-colors"
        :class="item.isCompleted ? 'border-slate-400 bg-slate-400 text-white' : 'border-blue-400 bg-white dark:bg-transparent hover:bg-blue-50 dark:hover:bg-blue-900/50'"
      >
        <svg v-if="item.isCompleted" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
      </div>
    </div>
  </div>
</template>