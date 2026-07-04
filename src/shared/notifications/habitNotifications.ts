import { LocalNotifications } from '@capacitor/local-notifications'
import dayjs from 'dayjs'

const REMINDER_MINUTES_BEFORE = 10

// Ceiling: los IDs son habitId*100 + dayOffset (offset 0-29, el mismo rango de 30 días
// que HabitFormView materializa en plannerItems). Si esa ventana alguna vez crece por
// encima de 100 días, este esquema choca con el bloque del siguiente habitId: hay que
// subir el multiplicador (ej. *1000) si se amplía la ventana de programación.
export const notificationIdFor = (habitId: number, dayOffset: number) => habitId * 100 + dayOffset

export interface ScheduleTimeInput {
  habitId: number
  startTime: string // 'HH:mm'
  days: number
  now?: dayjs.Dayjs // inyectable para pruebas
}

/** Calcula qué recordatorios deberían dispararse (10 min antes de cada ocurrencia), sin tocar Capacitor. */
export function buildScheduleTimes({ habitId, startTime, days, now = dayjs() }: ScheduleTimeInput) {
  const [hour, minute] = startTime.split(':').map(Number)
  return Array.from({ length: days }, (_, offset) => {
    const at = now.add(offset, 'day').hour(hour).minute(minute).second(0).millisecond(0)
      .subtract(REMINDER_MINUTES_BEFORE, 'minute')
    return at.isAfter(now) ? { id: notificationIdFor(habitId, offset), at } : null
  }).filter((entry): entry is { id: number; at: dayjs.Dayjs } => entry !== null)
}

async function ensurePermission() {
  const current = await LocalNotifications.checkPermissions()
  if (current.display === 'granted') return true
  const requested = await LocalNotifications.requestPermissions()
  return requested.display === 'granted'
}

/** Programa (o reprograma) los recordatorios de un hábito para los próximos `days` días. */
export async function scheduleHabitNotifications(
  habitId: number,
  body: string,
  startTime: string,
  days = 30
) {
  if (!(await ensurePermission())) return
  const times = buildScheduleTimes({ habitId, startTime, days })
  if (!times.length) return

  await LocalNotifications.schedule({
    notifications: times.map(({ id, at }) => ({
      id,
      title: 'Daily Planner',
      body,
      schedule: { at: at.toDate() }
    }))
  })
}

/** Cancela todos los recordatorios previamente programados para un hábito. */
export async function cancelHabitNotifications(habitId: number, days = 30) {
  await LocalNotifications.cancel({
    notifications: Array.from({ length: days }, (_, offset) => ({ id: notificationIdFor(habitId, offset) }))
  })
}
