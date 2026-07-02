import { onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { App } from '@capacitor/app'

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
        alert('Presiona de nuevo para salir')
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