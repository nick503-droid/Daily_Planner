<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { usePlannerStore } from '../../app/stores/planner'
import { db } from '../../shared/database/db'

const router = useRouter()
const store = usePlannerStore()

// Estado del formulario
const title = ref('')
const startTime = ref('08:00')
const endTime = ref('09:00')
const notes = ref('')

const saveTask = async () => {
  if (!title.value) {
    alert('El título es obligatorio')
    return
  }

  try {
    await db.plannerItems.add({
      id: crypto.randomUUID(),
      date: store.selectedDate, // Se guarda en el día que estábamos viendo
      title: title.value,
      startTime: startTime.value,
      endTime: endTime.value,
      notes: notes.value,
      isCompleted: false
    })

    await store.loadItemsForSelectedDate()
    router.back() // Regresamos al planificador
  } catch (error) {
    console.error(error)
  }
}
</script>

<template>
  <div class="flex flex-col h-screen bg-slate-50 dark:bg-black z-50">
    
    <header class="flex items-center justify-between px-4 py-4 bg-white dark:bg-black border-b border-slate-200 dark:border-slate-800">
      <button @click="router.back()" class="text-slate-500 font-medium active:opacity-70">
        Cancelar
      </button>
      <h1 class="text-lg font-bold">Nueva Tarea</h1>
      <button @click="saveTask" class="text-blue-600 dark:text-blue-400 font-bold active:opacity-70">
        Guardar
      </button>
    </header>

    <main class="flex-1 p-4 overflow-y-auto">
      <div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-4 space-y-4">
        
        <div>
          <label class="block text-xs font-semibold text-slate-500 uppercase mb-1">Título</label>
          <input 
            v-model="title" 
            type="text" 
            placeholder="Ej. Leer 20 páginas"
            class="w-full text-lg border-b border-slate-200 dark:border-slate-700 bg-transparent py-2 focus:outline-none focus:border-blue-500"
          >
        </div>

        <div class="flex gap-4">
          <div class="flex-1">
            <label class="block text-xs font-semibold text-slate-500 uppercase mb-1">Inicio</label>
            <input 
              v-model="startTime" 
              type="time" 
              class="w-full bg-slate-100 dark:bg-black rounded-lg p-3 text-center font-medium focus:outline-none"
            >
          </div>
          <div class="flex-1">
            <label class="block text-xs font-semibold text-slate-500 uppercase mb-1">Fin</label>
            <input 
              v-model="endTime" 
              type="time" 
              class="w-full bg-slate-100 dark:bg-black rounded-lg p-3 text-center font-medium focus:outline-none"
            >
          </div>
        </div>

        <div>
          <label class="block text-xs font-semibold text-slate-500 uppercase mb-1">Notas (Opcional)</label>
          <textarea 
            v-model="notes" 
            rows="3"
            placeholder="Detalles adicionales..."
            class="w-full bg-slate-50 dark:bg-black border border-slate-200 dark:border-slate-700 rounded-lg p-3 resize-none focus:outline-none focus:border-blue-500"
          ></textarea>
        </div>

      </div>
    </main>
  </div>
</template>