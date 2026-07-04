import { onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { App } from '@capacitor/app'
import { i18n } from '../../shared/i18n'

export function useExitGuard() {
  const router = useRouter()
  let lastClick = 0

  const handleBack = () => {
    const now = Date.now()
    if (now - lastClick < 500) { // Doble clic rápido
      App.exitApp()
    } else {
      lastClick = now
      // Si estamos en la raíz (ej: /planner), damos el aviso. Si no, volvemos atrás.
      if (router.currentRoute.value.path === '/planner') {
        alert(i18n.global.t('exit.pressAgain'))
      } else {
        router.push('/planner')
      }
    }
  }

  onMounted(() => {
    App.addListener('backButton', handleBack)
  })

  onUnmounted(() => {
    App.removeAllListeners()
  })
}