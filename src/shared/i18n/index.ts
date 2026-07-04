import { createI18n } from 'vue-i18n'
import dayjs from 'dayjs'
import 'dayjs/locale/es'
// 'en' es el locale por defecto de dayjs, no requiere import aparte.

export type Locale = 'es' | 'en'
export const STORAGE_KEY = 'daily-planner-locale'

const messages = {
  es: {
    nav: { planner: 'Planner', habits: 'Hábitos', stats: 'Logros' },
    language: {
      title: '¿En qué idioma prefieres usar la app?',
      subtitle: 'Podrás cambiarlo luego en Configuración',
      continue: 'Continuar'
    },
    habits: {
      title: 'Mis Hábitos',
      empty1: 'Aún no tienes hábitos.',
      empty2: 'Presiona el botón + para empezar.',
      streak: 'Racha',
      record: 'Récord'
    },
    habitForm: {
      cancel: 'Cancelar',
      newTitle: 'Nuevo Hábito',
      create: 'Crear',
      nameLabel: 'Nombre del hábito',
      namePlaceholder: 'Ej. Ir al gimnasio',
      scheduleTitle: 'Programar todos los días',
      scheduleSubtitle: 'Añadir automáticamente al planificador',
      start: 'Inicio',
      end: 'Fin',
      color: 'Color',
      icon: 'Ícono',
      nameRequired: 'Por favor, dale un nombre a tu hábito.'
    },
    editHabit: {
      cancel: 'Cancelar',
      title: 'Editar Hábito',
      save: 'Guardar',
      name: 'NOMBRE',
      color: 'COLOR',
      start: 'INICIO',
      end: 'FIN',
      delete: 'Eliminar Hábito',
      confirmDelete: '¿Eliminar este hábito permanentemente?'
    },
    settings: {
      title: 'Configuración',
      appearance: 'Apariencia',
      darkMode: 'Modo Oscuro',
      language: 'Idioma',
      dataSection: 'Datos (Próximamente)',
      exportBackup: 'Exportar Backup Manual'
    },
    stats: { title: 'Analítica de Vida', total: 'Total' },
    exit: { pressAgain: 'Presiona de nuevo para salir' },
    notifications: { habitSoon: 'Pronto empezará "{name}"' }
  },
  en: {
    nav: { planner: 'Planner', habits: 'Habits', stats: 'Stats' },
    language: {
      title: 'Which language do you want to use?',
      subtitle: 'You can change this later in Settings',
      continue: 'Continue'
    },
    habits: {
      title: 'My Habits',
      empty1: "You don't have any habits yet.",
      empty2: 'Tap the + button to start.',
      streak: 'Streak',
      record: 'Best'
    },
    habitForm: {
      cancel: 'Cancel',
      newTitle: 'New Habit',
      create: 'Create',
      nameLabel: 'Habit name',
      namePlaceholder: 'E.g. Go to the gym',
      scheduleTitle: 'Schedule every day',
      scheduleSubtitle: 'Automatically add it to the planner',
      start: 'Start',
      end: 'End',
      color: 'Color',
      icon: 'Icon',
      nameRequired: 'Please give your habit a name.'
    },
    editHabit: {
      cancel: 'Cancel',
      title: 'Edit Habit',
      save: 'Save',
      name: 'NAME',
      color: 'COLOR',
      start: 'START',
      end: 'END',
      delete: 'Delete Habit',
      confirmDelete: 'Delete this habit permanently?'
    },
    settings: {
      title: 'Settings',
      appearance: 'Appearance',
      darkMode: 'Dark Mode',
      language: 'Language',
      dataSection: 'Data (Coming soon)',
      exportBackup: 'Export Manual Backup'
    },
    stats: { title: 'Life Analytics', total: 'Total' },
    exit: { pressAgain: 'Press again to exit' },
    notifications: { habitSoon: '"{name}" is starting soon' }
  }
}

const storedLocale = (localStorage.getItem(STORAGE_KEY) as Locale | null) ?? 'es'

export const i18n = createI18n({
  legacy: false,
  locale: storedLocale,
  fallbackLocale: 'es',
  messages
})

// Mantiene el formato de fechas de dayjs (usado en Planner) sincronizado con el idioma elegido.
dayjs.locale(storedLocale === 'en' ? 'en' : 'es')

export function setLocale(locale: Locale) {
  i18n.global.locale.value = locale
  localStorage.setItem(STORAGE_KEY, locale)
  dayjs.locale(locale === 'en' ? 'en' : 'es')
}

export function hasStoredLocale() {
  return localStorage.getItem(STORAGE_KEY) !== null
}
