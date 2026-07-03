<template>
  <nav class="fixed bottom-0 left-0 right-0 bg-white dark:bg-[#050505] border-t border-slate-100 dark:border-slate-900 px-6 py-2 flex justify-around items-center z-40">
    <!-- Planner -->
    <router-link to="/planner" class="flex flex-col items-center text-xs font-medium text-slate-400 dark:text-slate-500" active-class="text-blue-600 dark:text-blue-500">
      <!-- Tu SVG de Planner -->
      <span>Planner</span>
    </router-link>

    <!-- Hábitos -->
    <router-link to="/habits" class="flex flex-col items-center text-xs font-medium text-slate-400 dark:text-slate-500" active-class="text-blue-600 dark:text-blue-500">
      <!-- Tu SVG de Hábitos -->
      <span>Hábitos</span>
    </router-link>

    <!-- Logros / Estadísticas -->
    <router-link to="/statistics" class="flex flex-col items-center text-xs font-medium text-slate-400 dark:text-slate-500" active-class="text-blue-600 dark:text-blue-500">
      <!-- Tu SVG de Logros -->
      <span>Logros</span>
    </router-link>
  </nav>
</template>

<style scoped>
/* Compensación UX para sistemas de navegación por gestos nativos de Android/iOS */
.safe-bottom {
  padding-bottom: env(safe-area-inset-bottom, 0px);
  height: calc(4rem + env(safe-area-inset-bottom, 0px));
}
</style>