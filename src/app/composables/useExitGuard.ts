import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { App } from '@capacitor/app'

/**
 * Maneja el botón "Atrás" físico de Android.
 * - Si no estamos en la raíz (/planner), simplemente navega ahí.
 * - Si ya estamos en la raíz, en vez del viejo esquema de "doble tap para
 *   salir" (poco intuitivo y con un alert() feo), mostramos un modal de
 *   confirmación. Si el usuario confirma, ahí sí cerramos la app.
 */
export function useExitGuard() {
  const router = useRouter()
  const showExitConfirm = ref(false)

  const handleBack = () => {
    // Si el modal ya está abierto, un segundo toque del botón atrás no debe
    // hacer nada raro (ni abrir otro modal encima).
    if (showExitConfirm.value) return

    if (router.currentRoute.value.path === '/planner') {
      showExitConfirm.value = true
    } else {
      router.push('/planner')
    }
  }

  const confirmExit = () => {
    showExitConfirm.value = false
    App.exitApp()
  }

  const cancelExit = () => {
    showExitConfirm.value = false
  }

  onMounted(() => {
    App.addListener('backButton', handleBack)
  })

  onUnmounted(() => {
    App.removeAllListeners()
  })

  return { showExitConfirm, confirmExit, cancelExit }
}
