export interface LayoutInfo {
  col: number
  cols: number
  span: number
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
 * Agrupa los ítems que coinciden en horario y les asigna un índice de columna (col)
 * y el total de coincidencias en ese grupo (cols).
 * De esta manera el componente visual puede presentarlos en cascada respetando 
 * exactamente su hora de inicio (top = startTime).
 */
export function computeTimelineLayout(items: TimelineLike[]): Map<string, LayoutInfo> {
  const result = new Map<string, LayoutInfo>()
  if (items.length === 0) return result

  const parsed = items
    .filter((item): item is TimelineLike & { id: string } => !!item.id)
    .map(item => {
      const start = toMinutes(item.startTime || '00:00')
      let end = toMinutes(item.endTime || item.startTime || '00:00')
      if (end < start + 65) {
        end = start + 65
      }
      return { id: item.id, start, end }
    })
    .sort((a, b) => a.start - b.start)

  let cluster: typeof parsed = []
  let clusterEnd = -Infinity

  const flushCluster = () => {
    if (cluster.length === 0) return

    const colEndTimes: number[] = []
    const assigned: { id: string; col: number; start: number; end: number }[] = []

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
      assigned.push({ id: item.id, col: placedCol, start: item.start, end: item.end })
    }

    const cols = colEndTimes.length
    for (const a of assigned) {
      result.set(a.id, { col: a.col, cols, span: 1 })
    }
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

