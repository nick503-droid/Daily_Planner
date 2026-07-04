<script setup lang="ts">
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
</script>

<template>
  <div class="w-full min-h-screen bg-slate-50 dark:bg-black pb-24">
    <!-- CRUCIAL: Aquí se renderizan tus vistas (Planner, Habits, Statistics) -->
    <main class="w-full">
      <slot />
    </main>

    <!-- Menú Inferior Premium de 3 Pestañas perfectamente alineado -->
    <nav class="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white/80 dark:bg-[#050505]/80 backdrop-blur-md border-t border-slate-100 dark:border-slate-900/60 px-6 py-2 flex justify-around items-center z-40 shadow-lg">
      
      <!-- Vista: Planner -->
      <router-link to="/planner" class="flex flex-col items-center gap-1 text-[10px] font-bold text-slate-400 dark:text-slate-500 transition-colors" active-class="text-blue-600 dark:text-blue-500">
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
        <span>{{ t('nav.planner') }}</span>
      </router-link>

      <!-- Vista: Hábitos -->
      <router-link to="/habits" class="flex flex-col items-center gap-1 text-[10px] font-bold text-slate-400 dark:text-slate-500 transition-colors" active-class="text-blue-600 dark:text-blue-500">
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>
        <span>{{ t('nav.habits') }}</span>
      </router-link>

      <!-- Vista: Logros (Estadísticas) -->
      <router-link to="/statistics" class="flex flex-col items-center gap-1 text-[10px] font-bold text-slate-400 dark:text-slate-500 transition-colors" active-class="text-blue-600 dark:text-blue-500">
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" x2="18" y1="20" y2="10"/><line x1="12" x2="12" y1="20" y2="4"/><line x1="6" x2="6" y1="20" y2="14"/></svg>
        <span>{{ t('nav.stats') }}</span>
      </router-link>
    </nav>
  </div>
</template>