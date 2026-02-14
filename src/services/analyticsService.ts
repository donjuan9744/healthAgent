import type {
  EngagementMetrics,
  NutritionLog,
  TrendPoint,
  WeeklySummary,
  WorkoutLog,
} from '../types/models'
import { startOfWeekIso } from '../utils/date'

export const analyticsService = {
  weeklySummary(workoutLogs: WorkoutLog[], nutritionLogs: NutritionLog[], plannedPerWeek: number): WeeklySummary {
    const weekStart = startOfWeekIso()
    const weekWorkoutLogs = workoutLogs.filter((log) => log.date >= weekStart)
    const weekNutrition = nutritionLogs.filter((log) => log.date >= weekStart)

    return {
      weekStart,
      workoutsCompleted: weekWorkoutLogs.filter((log) => log.completed).length,
      workoutsPlanned: plannedPerWeek,
      avgCalories:
        weekNutrition.length > 0
          ? Math.round(weekNutrition.reduce((sum, entry) => sum + entry.calories, 0) / weekNutrition.length)
          : 0,
      streakDays: new Set(weekWorkoutLogs.filter((log) => log.completed).map((log) => log.date)).size,
    }
  },

  trends(workoutLogs: WorkoutLog[], nutritionLogs: NutritionLog[]): TrendPoint[] {
    const buckets = new Map<string, TrendPoint>()

    workoutLogs.forEach((log) => {
      const current = buckets.get(log.date) ?? { label: log.date, workouts: 0, calories: 0 }
      current.workouts += log.completed ? 1 : 0
      buckets.set(log.date, current)
    })

    nutritionLogs.forEach((log) => {
      const current = buckets.get(log.date) ?? { label: log.date, workouts: 0, calories: 0 }
      current.calories += log.calories
      buckets.set(log.date, current)
    })

    return [...buckets.values()].sort((a, b) => a.label.localeCompare(b.label)).slice(-7)
  },

  engagementMetrics(workoutLogs: WorkoutLog[], motivationInteractions: number): EngagementMetrics {
    const activeDays = new Set(workoutLogs.map((entry) => entry.date)).size
    const weeks = Math.max(1, Math.ceil(activeDays / 7))

    return {
      dauWauRatio: Number((Math.min(1, activeDays / (weeks * 7))).toFixed(2)),
      averageSessionMinutes: 18,
      motivationInteractions,
      retention30d: Math.min(100, activeDays * 4),
    }
  },
}
