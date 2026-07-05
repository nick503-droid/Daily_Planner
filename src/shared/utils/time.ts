/**
 * Convierte una hora en formato "HH:mm" (24h) a formato 12h tipo "5:15pm".
 * Se hace con matemática simple de strings (sin dayjs) para evitar problemas
 * de timezone/locale al construir fechas falsas solo para formatear una hora.
 */
export function formatTime12h(time?: string | null): string {
  if (!time) return ''

  const [hoursStr, minutesStr] = time.split(':')
  const hours24 = Number(hoursStr)
  const minutes = Number(minutesStr)

  if (Number.isNaN(hours24) || Number.isNaN(minutes)) return time

  const period = hours24 >= 12 ? 'pm' : 'am'
  let hours12 = hours24 % 12
  if (hours12 === 0) hours12 = 12

  const paddedMinutes = String(minutes).padStart(2, '0')
  return `${hours12}:${paddedMinutes}${period}`
}
