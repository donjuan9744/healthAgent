import { analyticsService } from '../services/analyticsService'
import { motivationService } from '../services/motivationService'
import { progressService } from '../services/progressService'
import type {
  Badge,
  EngagementMetrics,
  NutritionLog,
  ProgressSnapshot,
  Reminder,
  TrendPoint,
  WeeklySummary,
  WorkoutLog,
} from '../types/models'
import { isoDate } from '../utils/date'
import { createStore } from './createStore'

interface ProgressPersisted {
  workoutLogs: WorkoutLog[]
  nutritionLogs: NutritionLog[]
  badges: Badge[]
  reminders: Reminder[]
  motivationInteractions: number
}

interface ProgressStoreState extends ProgressPersisted {
  celebrationActive: boolean
  addWorkoutLog: (userId: string, exerciseIds: string[], durationMin: number) => Promise<void>
  addNutritionLog: (userId: string, mealIds: string[], calories: number) => Promise<void>
  loadProgress: (userId: string) => Promise<void>
  snapshot: (plannedPerWeek: number) => ProgressSnapshot
  weeklySummary: (plannedPerWeek: number) => WeeklySummary
  trendData: () => TrendPoint[]
  engagement: () => EngagementMetrics
  hydrateMotivation: () => void
  dismissCelebration: () => void
  sendReminders: () => Promise<void>
}

export const selectWorkoutLogs = (state: ProgressStoreState): WorkoutLog[] => state.workoutLogs
export const selectNutritionLogs = (state: ProgressStoreState): NutritionLog[] => state.nutritionLogs
export const selectMotivationInteractions = (state: ProgressStoreState): number => state.motivationInteractions
export const selectBadges = (state: ProgressStoreState): Badge[] => state.badges
export const selectReminders = (state: ProgressStoreState): Reminder[] => state.reminders
export const selectCelebrationActive = (state: ProgressStoreState): boolean => state.celebrationActive
export const selectSendReminders = (state: ProgressStoreState): (() => Promise<void>) => state.sendReminders
export const selectDismissCelebration = (state: ProgressStoreState): (() => void) => state.dismissCelebration

const emptyPersisted: ProgressPersisted = {
  workoutLogs: [],
  nutritionLogs: [],
  badges: [],
  reminders: [],
  motivationInteractions: 0,
}

let store: ReturnType<typeof createStore<ProgressStoreState>>

store = createStore<ProgressStoreState>({
  ...emptyPersisted,
  celebrationActive: false,

  addWorkoutLog: async (userId, exerciseIds, durationMin) => {
    const log: WorkoutLog = {
      id: `wl-${crypto.randomUUID()}`,
      userId,
      date: isoDate(),
      exerciseIds,
      completed: true,
      durationMin,
    }

    const current = store.getState()
    const workoutLogs = [log, ...current.workoutLogs]
    const snapshot = progressService.snapshot(workoutLogs, current.nutritionLogs, 4)
    const newBadges = motivationService.buildBadges(snapshot.streakDays, snapshot.totalWorkouts)

    store.setState({
      workoutLogs,
      badges: newBadges,
      celebrationActive: newBadges.length > current.badges.length,
    })

    await persistProgress(userId, {
      ...getPersisted(store.getState()),
      workoutLogs,
      badges: newBadges,
    })
  },

  addNutritionLog: async (userId, mealIds, calories) => {
    const log: NutritionLog = {
      id: `nl-${crypto.randomUUID()}`,
      userId,
      date: isoDate(),
      mealIds,
      calories,
    }

    const nutritionLogs = [log, ...store.getState().nutritionLogs]
    store.setState({ nutritionLogs })

    await persistProgress(userId, {
      ...getPersisted(store.getState()),
      nutritionLogs,
    })
  },

  loadProgress: async (userId) => {
    const loaded = await loadPersisted(userId)
    store.setState({ ...loaded })
  },

  snapshot: (plannedPerWeek) => progressService.snapshot(store.getState().workoutLogs, store.getState().nutritionLogs, plannedPerWeek),

  weeklySummary: (plannedPerWeek) =>
    analyticsService.weeklySummary(store.getState().workoutLogs, store.getState().nutritionLogs, plannedPerWeek),

  trendData: () => analyticsService.trends(store.getState().workoutLogs, store.getState().nutritionLogs),

  engagement: () =>
    analyticsService.engagementMetrics(store.getState().workoutLogs, store.getState().motivationInteractions),

  hydrateMotivation: () => {
    if (store.getState().reminders.length === 0) {
      store.setState({ reminders: motivationService.defaultReminders() })
    }
  },

  dismissCelebration: () => store.setState({ celebrationActive: false }),

  sendReminders: async () => {
    await motivationService.triggerReminderNotifications(store.getState().reminders)
    store.setState((state: ProgressStoreState) => ({ motivationInteractions: state.motivationInteractions + 1 }))
  },
})

const getPersisted = (state: ProgressStoreState): ProgressPersisted => ({
  workoutLogs: state.workoutLogs,
  nutritionLogs: state.nutritionLogs,
  badges: state.badges,
  reminders: state.reminders,
  motivationInteractions: state.motivationInteractions,
})

const persistProgress = async (userId: string, data: ProgressPersisted): Promise<void> => {
  localStorage.setItem(`progress:${userId}`, JSON.stringify(data))
}

const loadPersisted = async (userId: string): Promise<ProgressPersisted> => {
  const raw = localStorage.getItem(`progress:${userId}`)
  if (!raw) return emptyPersisted

  try {
    return JSON.parse(raw) as ProgressPersisted
  } catch {
    return emptyPersisted
  }
}

export const useProgressStore = store.useStore
export const getProgressSnapshot = (
  workoutLogs: WorkoutLog[],
  nutritionLogs: NutritionLog[],
  plannedPerWeek: number,
): ProgressSnapshot => progressService.snapshot(workoutLogs, nutritionLogs, plannedPerWeek)

export const getWeeklySummary = (
  workoutLogs: WorkoutLog[],
  nutritionLogs: NutritionLog[],
  plannedPerWeek: number,
): WeeklySummary => analyticsService.weeklySummary(workoutLogs, nutritionLogs, plannedPerWeek)

export const getTrendData = (workoutLogs: WorkoutLog[], nutritionLogs: NutritionLog[]): TrendPoint[] =>
  analyticsService.trends(workoutLogs, nutritionLogs)

export const getEngagementMetrics = (workoutLogs: WorkoutLog[], motivationInteractions: number): EngagementMetrics =>
  analyticsService.engagementMetrics(workoutLogs, motivationInteractions)
