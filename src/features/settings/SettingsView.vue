<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useDark, useToggle } from '@vueuse/core'
import { useI18n } from 'vue-i18n'
import { setLocale } from '../../shared/i18n'

const router = useRouter()
const { t, locale } = useI18n()

// useDark maneja automáticamente la lectura/escritura en el localStorage 
// y añade la clase 'dark' a la etiqueta <html>
const isDark = useDark()
const toggleDark = useToggle(isDark)
</script>

<template>
  <div class="flex flex-col h-screen bg-slate-50 dark:bg-black z-50 transition-colors duration-300">
    
    <header class="flex items-center px-4 py-4 bg-white dark:bg-black border-b border-slate-200 dark:border-slate-800">
      <button @click="router.back()" class="p-2 -ml-2 text-slate-500 active:opacity-70">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
      </button>
      <h1 class="text-lg font-bold ml-2 text-slate-800 dark:text-slate-100">{{ t('settings.title') }}</h1>
    </header>

    <main class="flex-1 p-4 overflow-y-auto space-y-6">

      <div class="space-y-2">
        <h2 class="text-xs font-semibold text-slate-500 uppercase ml-1">{{ t('settings.language') }}</h2>
        <div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-4 flex gap-3">
          <button
            @click="setLocale('es')"
            class="flex-1 py-2 rounded-lg font-semibold transition-colors"
            :class="locale === 'es' ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'"
          >Español</button>
          <button
            @click="setLocale('en')"
            class="flex-1 py-2 rounded-lg font-semibold transition-colors"
            :class="locale === 'en' ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'"
          >English</button>
        </div>
      </div>

      <div class="space-y-2">
        <h2 class="text-xs font-semibold text-slate-500 uppercase ml-1">{{ t('settings.appearance') }}</h2>
        
        <div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-4">
          <div class="flex items-center justify-between" @click="toggleDark()">
            <div class="flex items-center gap-3">
              <span class="text-slate-400">
                <svg v-if="isDark" xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>
              </span>
              <span class="font-medium text-slate-800 dark:text-slate-100">{{ t('settings.darkMode') }}</span>
            </div>
            
            <div 
              class="w-12 h-6 rounded-full p-1 transition-colors duration-300 ease-in-out cursor-pointer"
              :class="isDark ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-600'"
            >
              <div 
                class="w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-300"
                :class="isDark ? 'translate-x-6' : 'translate-x-0'"
              ></div>
            </div>
          </div>
        </div>
      </div>

      <div class="space-y-2">
        <h2 class="text-xs font-semibold text-slate-500 uppercase ml-1">{{ t('settings.dataSection') }}</h2>
        <div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-4 opacity-50">
          <div class="flex items-center gap-3">
            <span class="text-slate-400">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
            </span>
            <span class="font-medium text-slate-800 dark:text-slate-100">{{ t('settings.exportBackup') }}</span>
          </div>
        </div>
      </div>

    </main>
  </div>
</template>