import Dexie, { type Table } from 'dexie'
import type { Habit, PlannerItem, HabitHistoryLog } from '../types/database'

export class DailyPlannerDB extends Dexie {
  habits!: Table<Habit, number>
  plannerItems!: Table<PlannerItem, string>
  habitHistory!: Table<HabitHistoryLog, number> // <--- Nueva tabla

  constructor() {
    super('DailyPlannerDB')
    
    // VERSIÓN 2: Añadida la tabla history y nuevos índices
    this.version(2).stores({
      habits: '++id, createdAt',
      plannerItems: 'id, date, habitId, isCompleted',
      // Índice compuesto [habitId+date] para búsquedas ultra rápidas del heatmap
      habitHistory: '++id, habitId, date, [habitId+date]' 
    })
  }
}

export const db = new DailyPlannerDB()