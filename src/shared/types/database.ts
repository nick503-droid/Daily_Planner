export interface Habit {
  id?: number;
  name: string;
  color: string; // Hex code para personalización (Ej: #ef4444)
  icon: string;  // Nombre del icono de Lucide
  createdAt: string; // YYYY-MM-DD
  
  // Metadatos de Gamificación (Precalculados para rendimiento)
  currentStreak: number;
  bestStreak: number;
  totalCompletedDays: number;
  totalMissedDays: number;
}

// Esta tabla ligera dibujará el "Mapa de calor tipo GitHub"
export interface HabitHistoryLog {
  id?: number; // Autogenerado
  habitId: number;
  date: string; // YYYY-MM-DD
  status: 'completed' | 'missed';
}

export interface PlannerItem {
  id?: string;
  date: string;
  startTime: string;
  endTime: string;
  title: string;
  notes?: string;
  isCompleted: boolean;
  habitId?: number; // Si este ítem es parte de un hábito, llevará su ID aquí
}