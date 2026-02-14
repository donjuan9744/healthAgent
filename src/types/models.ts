export type Goal = 'fat_loss' | 'muscle_gain' | 'endurance' | 'general_fitness'

export interface AuthUser {
  uid: string
  email: string
  displayName?: string
}

export interface UserPreferences {
  highContrast: boolean
  fontScale: 'normal' | 'large' | 'xlarge'
  locale: string
  consentAccepted: boolean
}

export interface UserProfile {
  uid: string
  email: string
  age: number
  weightKg: number
  goals: Goal[]
  equipment: string[]
  scheduleDays: number
  onboardingComplete: boolean
  createdAt: string
  updatedAt: string
  preferences: UserPreferences
}

export interface WorkoutExercise {
  id: string
  name: string
  description: string
  targetMuscles: string[]
  equipment: string[]
  prescription: WorkoutPrescription
  intensity: 'low' | 'medium' | 'high'
  imageUrl: string
}

export type WorkoutPrescription =
  | {
      type: 'reps'
      sets: number
      reps: number
    }
  | {
      type: 'time'
      sets: number
      seconds: number
    }

export interface NutritionMeal {
  id: string
  name: string
  description: string
  calories: number
  proteinG: number
  carbsG: number
  fatsG: number
  tags: string[]
  imageUrl: string
}

export interface DailyPlan {
  day: string
  dayType?: 'training' | 'conditioning' | 'recovery' | 'rest'
  workout: WorkoutExercise[]
  meals: NutritionMeal[]
  notes: string
}

export interface GeneratedPlan {
  id: string
  userId: string
  createdAt: string
  weeklyPlan: DailyPlan[]
}

export interface WorkoutLog {
  id: string
  userId: string
  date: string
  exerciseIds: string[]
  completed: boolean
  durationMin: number
}

export interface NutritionLog {
  id: string
  userId: string
  date: string
  mealIds: string[]
  calories: number
}

export interface Milestone {
  id: string
  title: string
  achievedAt: string
  detail: string
}

export interface Badge {
  id: string
  title: string
  description: string
  earnedAt: string
}

export interface Reminder {
  id: string
  title: string
  message: string
  schedule: string
  enabled: boolean
}

export interface ProgressSnapshot {
  streakDays: number
  totalWorkouts: number
  totalCaloriesTracked: number
  milestones: Milestone[]
  weeklyCompletionRate: number
}

export interface WeeklySummary {
  weekStart: string
  workoutsCompleted: number
  workoutsPlanned: number
  avgCalories: number
  streakDays: number
}

export interface TrendPoint {
  label: string
  workouts: number
  calories: number
}

export interface EngagementMetrics {
  dauWauRatio: number
  averageSessionMinutes: number
  motivationInteractions: number
  retention30d: number
}
