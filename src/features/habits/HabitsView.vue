<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { db } from '../../shared/database/db'
import type { Habit } from '../../shared/types/database'

const { t } = useI18n()

// Importamos los iconos
import { Activity, Book, Dumbbell, Heart, Coffee, Droplets } from 'lucide-vue-next'

// Estado para guardar la lista de hábitos
const habits = ref<Habit[]>([])

// Diccionario para convertir el texto guardado en un componente real
const iconMap: Record<string, any> = {
  Activity, Book, Dumbbell, Heart, Coffee, Droplets
}

// Cargar los datos desde Dexie
const loadHabits = async () => {
  try {
    habits.value = await db.habits.toArray()
  } catch (error) {
    console.error('Error cargando hábitos:', error)
  }
}

// Se ejecuta automáticamente al abrir esta vista
onMounted(() => {
  loadHabits()
})
</script>

<template>
  <div class="flex flex-col h-full bg-slate-50 dark:bg-black relative">
    <header class="px-4 py-6 bg-white dark:bg-black border-b border-slate-200 dark:border-slate-800">
      <h1 class="text-2xl font-bold text-slate-800 dark:text-slate-100">{{ t('habits.title') }}</h1>
    </header>

    <div class="flex-1 overflow-y-auto p-4 pb-24 space-y-4">
      
      <!-- Estado vacío -->
      <div v-if="habits.length === 0" class="flex flex-col items-center justify-center h-40 text-slate-400">
        <component :is="Activity" :size="48" class="mb-4 opacity-50" />
        <p>{{ t('habits.empty1') }}</p>
        <p class="text-sm">{{ t('habits.empty2') }}</p>
      </div>

      <!-- Lista de Hábitos -->
      <router-link 
        v-for="habit in habits" 
        :key="habit.id"
        :to="`/habits/${habit.id}/edit`"
        class="block bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-700 flex items-center gap-4 transition-transform active:scale-95 cursor-pointer"
      >
        <!-- Icono / Color -->
        <div 
          class="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 bg-opacity-20 dark:bg-opacity-20"
          :style="{ backgroundColor: `${habit.color}33`, color: habit.color }"
        >
          <component :is="iconMap[habit.icon] || Activity" :size="24" :stroke-width="2.5" />
        </div>

        <!-- Info -->
        <div class="flex-1 overflow-hidden">
          <h2 class="text-lg font-bold text-slate-800 dark:text-slate-100 truncate">
            {{ habit.name }}
          </h2>
          <div class="flex gap-4 mt-1 text-xs font-medium text-slate-500 dark:text-slate-400">
            <span class="flex items-center gap-1">
              🔥 {{ t('habits.streak') }}: <span :style="{ color: habit.color }">{{ habit.currentStreak }}</span>
            </span>
            <span>
              🏆 {{ t('habits.record') }}: {{ habit.bestStreak }}
            </span>
          </div>
        </div>
        
        <!-- Flecha -->
        <div class="text-slate-300 dark:text-slate-600">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
        </div>
      </router-link>

    </div>

    <!-- Botón Flotante -->
    <router-link 
      to="/habits/new"
      class="absolute bottom-6 right-6 w-14 h-14 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white rounded-2xl shadow-lg flex items-center justify-center transition-all z-30"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
    </router-link>
  </div>
</template>