<script setup lang="ts">
import { useRouter } from 'vue-router'
import { setLocale } from '../../shared/i18n'
import type { Locale } from '../../shared/i18n'

const router = useRouter()

const choose = (locale: Locale) => {
  setLocale(locale)
  router.replace('/planner')
}
</script>

<template>
  <div class="w-full max-w-md mx-auto h-screen flex flex-col items-center justify-center gap-8 p-6 bg-white dark:bg-black text-center">
    <div>
      <h1 class="text-xl font-bold text-slate-800 dark:text-slate-100">Choose your language</h1>
      <h1 class="text-xl font-bold text-slate-800 dark:text-slate-100">Elige tu idioma</h1>
    </div>

    <div class="w-full space-y-3">
      <button
        @click="choose('es')"
        class="w-full p-4 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white rounded-2xl font-bold transition-all"
      >
        Español
      </button>
      <button
        @click="choose('en')"
        class="w-full p-4 bg-slate-100 dark:bg-slate-800 active:scale-95 text-slate-800 dark:text-white rounded-2xl font-bold transition-all"
      >
        English
      </button>
    </div>

    <p class="text-xs text-slate-400">
      Puedes cambiarlo luego en Configuración · You can change this later in Settings
    </p>
  </div>
</template>
