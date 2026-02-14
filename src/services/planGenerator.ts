import { nutritionLibrary } from '../data/nutritionLibrary'
import { workoutLibrary } from '../data/workoutLibrary'
import type { DailyPlan, GeneratedPlan, Goal, UserProfile, WorkoutExercise } from '../types/models'
import { dayLabels } from '../utils/date'

const goalToIntensity: Record<Goal, 'low' | 'medium' | 'high'> = {
  fat_loss: 'high',
  muscle_gain: 'high',
  endurance: 'medium',
  general_fitness: 'low',
}

const defaultPrescriptionByExerciseId = new Map(
  workoutLibrary.map((exercise) => [exercise.id, { ...exercise.prescription }]),
)

function ensureWorkoutPrescription(exercise: WorkoutExercise): WorkoutExercise {
  const fallbackPrescription = defaultPrescriptionByExerciseId.get(exercise.id) ?? {
    type: 'time' as const,
    sets: 1,
    seconds: 60,
  }

  if (!exercise.prescription || typeof exercise.prescription !== 'object') {
    return {
      ...exercise,
      prescription: { ...fallbackPrescription },
    }
  }

  if (
    exercise.prescription.type === 'reps' &&
    typeof exercise.prescription.sets === 'number' &&
    typeof exercise.prescription.reps === 'number'
  ) {
    return {
      ...exercise,
      prescription: { ...exercise.prescription },
    }
  }

  if (
    exercise.prescription.type === 'time' &&
    typeof exercise.prescription.sets === 'number' &&
    typeof exercise.prescription.seconds === 'number'
  ) {
    return {
      ...exercise,
      prescription: { ...exercise.prescription },
    }
  }

  return {
    ...exercise,
    prescription: { ...fallbackPrescription },
  }
}

export function normalizeGeneratedPlan(plan: GeneratedPlan): GeneratedPlan {
  const weeklyPlan = Array.isArray(plan.weeklyPlan) ? plan.weeklyPlan : []

  return {
    ...plan,
    weeklyPlan: weeklyPlan.map((day) => ({
      ...day,
      workout: (Array.isArray(day.workout) ? day.workout : []).map(ensureWorkoutPrescription),
    })),
  }
}

export const planGenerator = {
  generate(profile: UserProfile): GeneratedPlan {
    const preferredIntensity = goalToIntensity[profile.goals[0] ?? 'general_fitness']
    const equipmentSet = new Set(profile.equipment)

    const workouts = workoutLibrary.filter(
      (exercise) =>
        exercise.intensity === preferredIntensity ||
        exercise.equipment.some((item) => item === 'none' || equipmentSet.has(item)),
    )

    const meals = nutritionLibrary.filter((meal) =>
      profile.goals.some((goal) => meal.tags.includes(goal)) || meal.tags.includes('general_fitness'),
    )

    const weeklyPlan: DailyPlan[] = dayLabels.map((day, index) => ({
      day,
      workout: workouts
        .slice(index % workouts.length, (index % workouts.length) + 2)
        .concat(workouts.slice(0, 1))
        .map(ensureWorkoutPrescription),
      meals: meals.slice(index % meals.length, (index % meals.length) + 3),
      notes:
        index < profile.scheduleDays
          ? 'Primary training day. Focus on consistency and recovery hydration.'
          : 'Active recovery day. Prioritize mobility, walking, and sleep quality.',
    }))

    return {
      id: `plan-${crypto.randomUUID()}`,
      userId: profile.uid,
      createdAt: new Date().toISOString(),
      weeklyPlan,
    }
  },
}
