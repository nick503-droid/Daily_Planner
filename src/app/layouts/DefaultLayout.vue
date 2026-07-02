<template>
  <div class="flex flex-col h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-50 overflow-hidden">
    <main class="flex-1 overflow-y-auto pb-20 p-4">
      <slot />
    </main>

    <nav class="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 flex items-center justify-around px-2 z-50 safe-bottom">
      <router-link to="/planner" class="flex flex-col items-center justify-center w-16 h-full text-xs text-slate-500 dark:text-slate-400" active-class="text-blue-600 dark:text-blue-400 font-medium">
        <span class="text-xl">📅</span>
        <span class="mt-1">Planner</span>
      </router-link>
      
      <router-link to="/habits" class="flex flex-col items-center justify-center w-16 h-full text-xs text-slate-500 dark:text-slate-400" active-class="text-blue-600 dark:text-blue-400 font-medium">
        <span class="text-xl">🔥</span>
        <span class="mt-1">Hábitos</span>
      </router-link>

      <router-link to="/calendar" class="flex flex-col items-center justify-center w-16 h-full text-xs text-slate-500 dark:text-slate-400" active-class="text-blue-600 dark:text-blue-400 font-medium">
        <span class="text-xl">📆</span>
        <span class="mt-1">Calendario</span>
      </router-link>

      <router-link to="/statistics" class="flex flex-col items-center justify-center w-16 h-full text-xs text-slate-500 dark:text-slate-400" active-class="text-blue-600 dark:text-blue-400 font-medium">
        <span class="text-xl">📊</span>
        <span class="mt-1">Logros</span>
      </router-link>
    </nav>
  </div>
</template>

<style scoped>
/* Compensación UX para sistemas de navegación por gestos nativos de Android/iOS */
.safe-bottom {
  padding-bottom: env(safe-area-inset-bottom, 0px);
  height: calc(4rem + env(safe-area-inset-bottom, 0px));
}
</style>