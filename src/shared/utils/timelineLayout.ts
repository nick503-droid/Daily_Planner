export interface LayoutInfo {
  col: number
  cols: number
}

interface TimelineLike {
  id?: string
  startTime: string
  endTime?: string
}

function toMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number)
  return (h || 0) * 60 + (m || 0)
}

/**
 * Calcula, para cada ítem, en qué "columna" debe ir y cuántas columnas totales
 * tiene su grupo de solapamiento. Así, si hay 2+ hábitos a la misma hora,
 * la línea de tiempo los reparte en paralelo en vez de dibujarlos uno encima
 * del otro.
 *
 * Algoritmo (similar al usado por Google Calendar / apps de agenda):
 * 1. Se ordenan los ítems por hora de inicio.
 * 2. Se agrupan en "clusters" de ítems que se solapan entre sí en cadena.
 * 3. Dentro de cada cluster, se asigna cada ítem a la primera columna libre
 *    (greedy), y el cluster completo usa el máximo de columnas necesitadas.
 */
export function computeTimelineLayout(items: TimelineLike[]): Map<string, LayoutInfo> {
  const result = new Map<string, LayoutInfo>()
  if (items.length === 0) return result

  const parsed = items
    .filter((item): item is TimelineLike & { id: string } => !!item.id)
    .map(item => {
      const start = toMinutes(item.startTime || '00:00')
      let end = toMinutes(item.endTime || item.startTime || '00:00')
      // Si no hay duración real (endTime <= startTime), le damos 30min mínimos
      // para que el cálculo de solapamiento tenga sentido.
      if (end <= start) end = start + 30
      return { id: item.id, start, end }
    })
    .sort((a, b) => a.start - b.start)

  let cluster: typeof parsed = []
  let clusterEnd = -Infinity

  const flushCluster = () => {
    if (cluster.length === 0) return

    // colEndTimes[c] = hora (en minutos) en la que queda libre la columna c
    const colEndTimes: number[] = []
    const assigned: { id: string; col: number }[] = []

    for (const item of cluster) {
      let placedCol = -1
      for (let c = 0; c < colEndTimes.length; c++) {
        if (item.start >= colEndTimes[c]) {
          colEndTimes[c] = item.end
          placedCol = c
          break
        }
      }
      if (placedCol === -1) {
        colEndTimes.push(item.end)
        placedCol = colEndTimes.length - 1
      }
      assigned.push({ id: item.id, col: placedCol })
    }

    const cols = colEndTimes.length
    for (const a of assigned) result.set(a.id, { col: a.col, cols })
    cluster = []
  }

  for (const item of parsed) {
    if (cluster.length === 0 || item.start < clusterEnd) {
      cluster.push(item)
      clusterEnd = Math.max(clusterEnd, item.end)
    } else {
      flushCluster()
      cluster.push(item)
      clusterEnd = item.end
    }
  }
  flushCluster()

  return result
}
