import type { Milestone, NutritionLog, ProgressSnapshot, WorkoutLog } from '../types/models'

const uniqueWorkoutDays = (workoutLogs: WorkoutLog[]): number =>
  new Set(workoutLogs.filter((log) => log.completed).map((log) => log.date)).size

export const progressService = {
  computeStreak(workoutLogs: WorkoutLog[]): number {
    const completedDays = new Set(workoutLogs.filter((log) => log.completed).map((log) => log.date))
    const now = new Date()
    let streak = 0

    for (let i = 0; i < 365; i += 1) {
      const date = new Date(now)
      date.setDate(now.getDate() - i)
      const iso = date.toISOString().slice(0, 10)
      if (completedDays.has(iso)) {
        streak += 1
      } else if (i > 0) {
        break
      }
    }

    return streak
  },

  calculateWeeklyCompletion(workoutLogs: WorkoutLog[], plannedPerWeek: number): number {
    if (!plannedPerWeek) return 0
    const completed = workoutLogs.filter((log) => log.completed).length
    return Math.min(100, Math.round((completed / plannedPerWeek) * 100))
  },

  deriveMilestones(workoutLogs: WorkoutLog[], nutritionLogs: NutritionLog[]): Milestone[] {
    const milestones: Milestone[] = []
    const completedWorkouts = workoutLogs.filter((log) => log.completed).length
    const trackedMeals = nutritionLogs.reduce((acc, log) => acc + log.mealIds.length, 0)

    if (completedWorkouts >= 1) {
      milestones.push({
        id: 'm-first-workout',
        title: 'First Workout Complete',
        achievedAt: new Date().toISOString(),
        detail: 'You completed your first workout log. Strong start.',
      })
    }
    if (completedWorkouts >= 5) {
      milestones.push({
        id: 'm-five-workouts',
        title: 'Five Workout Sessions',
        achievedAt: new Date().toISOString(),
        detail: 'You reached five completed workouts.',
      })
    }
    if (trackedMeals >= 10) {
      milestones.push({
        id: 'm-ten-meals',
        title: 'Nutrition Consistency',
        achievedAt: new Date().toISOString(),
        detail: 'You tracked 10 meals. Nutrition momentum unlocked.',
      })
    }

    return milestones
  },

  snapshot(workoutLogs: WorkoutLog[], nutritionLogs: NutritionLog[], plannedPerWeek: number): ProgressSnapshot {
    return {
      streakDays: this.computeStreak(workoutLogs),
      totalWorkouts: uniqueWorkoutDays(workoutLogs),
      totalCaloriesTracked: nutritionLogs.reduce((sum, log) => sum + log.calories, 0),
      milestones: this.deriveMilestones(workoutLogs, nutritionLogs),
      weeklyCompletionRate: this.calculateWeeklyCompletion(workoutLogs, plannedPerWeek),
    }
  },
}
