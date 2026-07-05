<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import DefaultLayout from './app/layouts/DefaultLayout.vue'
import { useExitGuard } from './app/composables/useExitGuard'

const { showExitConfirm, confirmExit, cancelExit } = useExitGuard()
const { t } = useI18n()

const route = useRoute()
const layout = computed(() => {
  if (route.meta.layout === 'default') return DefaultLayout
  return 'div' // Comportamiento de layout en blanco o 'blank'
})
</script>

<template>
  <component :is="layout">
    <router-view />
  </component>

  <!-- Modal de confirmación al presionar "Atrás" en la pantalla principal -->
  <Transition name="exit-fade">
    <div
      v-if="showExitConfirm"
      class="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-6"
      @click.self="cancelExit"
    >
      <div class="w-full max-w-xs bg-white dark:bg-slate-900 rounded-2xl shadow-2xl p-6 text-center">
        <h2 class="text-base font-bold text-slate-800 dark:text-slate-100 mb-1">
          {{ t('exit.title') }}
        </h2>
        <p class="text-sm text-slate-500 dark:text-slate-400 mb-6">
          {{ t('exit.subtitle') }}
        </p>
        <div class="flex gap-3">
          <button
            @click="cancelExit"
            class="flex-1 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold active:scale-95 transition-transform"
          >
            {{ t('exit.no') }}
          </button>
          <button
            @click="confirmExit"
            class="flex-1 py-3 rounded-xl bg-rose-500 text-white font-semibold active:scale-95 transition-transform"
          >
            {{ t('exit.yes') }}
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.exit-fade-enter-active,
.exit-fade-leave-active {
  transition: opacity 0.15s ease;
}
.exit-fade-enter-from,
.exit-fade-leave-to {
  opacity: 0;
}
</style>
