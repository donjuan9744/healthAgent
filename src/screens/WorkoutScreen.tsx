import { useState } from 'react'
import { WorkoutCard } from '../components/workouts/WorkoutCard'
import { workoutLibrary } from '../data/workoutLibrary'
import { fetchAiWorkoutPlan, generateAiWorkoutPlan, type AiWeeklyPlanJson } from '../services/aiWorkoutService'
import { normalizeGeneratedPlan } from '../services/planGenerator'
import { usePlanStore } from '../state/planStore'
import { useUserStore } from '../state/userStore'
import type { GeneratedPlan, WorkoutExercise, WorkoutPrescription } from '../types/models'

const fallbackWorkout = workoutLibrary[0]
const aiWorkoutImage =
  'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=800&q=80'

function normalizeName(value: string): string {
  return value.trim().toLowerCase()
}

function getTodayDateString(): string {
  return new Date().toISOString().slice(0, 10)
}

function toTitleCase(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

function formatFocus(value: string): string {
  const normalized = value
    .trim()
    .replace(/^focus\s*:\s*/i, '')
    .replace(/[.,;:!?]+$/g, '')
    .replace(/\s+/g, ' ')
  return toTitleCase(normalized)
}

function formatDayHeader(day: string, dayType?: string): string {
  const normalizedDayType = dayType?.trim()
  if (!normalizedDayType) {
    return day
  }
  return `${day} — ${toTitleCase(normalizedDayType)}`
}

function toWorkoutExercise(exercise: AiWeeklyPlanJson['days'][number]['exercises'][number], index: number): WorkoutExercise {
  const template = workoutLibrary.find((item) => normalizeName(item.name) === normalizeName(exercise.name))
  const prescription: WorkoutPrescription =
    exercise.type === 'reps'
      ? {
          type: 'reps',
          sets: Math.max(1, Math.round(exercise.sets)),
          reps: Math.max(1, Math.round(exercise.reps ?? 10)),
        }
      : {
          type: 'time',
          sets: Math.max(1, Math.round(exercise.sets)),
          seconds: Math.max(1, Math.round(exercise.seconds ?? 60)),
        }

  return {
    id: template?.id ?? `ai-${normalizeName(exercise.name).replace(/\s+/g, '-')}-${index}`,
    name: exercise.name,
    description: template?.description ?? 'AI-generated movement tailored to your weekly goals.',
    targetMuscles: template?.targetMuscles ?? ['Full Body'],
    equipment: template?.equipment ?? ['none'],
    prescription,
    intensity: template?.intensity ?? 'medium',
    imageUrl: template?.imageUrl ?? fallbackWorkout?.imageUrl ?? aiWorkoutImage,
  }
}

function toGeneratedPlan(raw: AiWeeklyPlanJson, userId: string, currentPlan: GeneratedPlan | null): GeneratedPlan {
  const existingMealsByDay = new Map((currentPlan?.weeklyPlan ?? []).map((day) => [day.day, day.meals]))
  const existingMealsByIndex = (currentPlan?.weeklyPlan ?? []).map((day) => day.meals)

  return normalizeGeneratedPlan({
    id: `plan-ai-${crypto.randomUUID()}`,
    userId,
    createdAt: new Date().toISOString(),
    weeklyPlan: raw.days.map((day, dayIndex) => ({
      day: day.day,
      dayType: day.dayType,
      workout: day.exercises.map((exercise, exerciseIndex) =>
        toWorkoutExercise(exercise, dayIndex * 100 + exerciseIndex),
      ),
      meals: existingMealsByDay.get(day.day) ?? existingMealsByIndex[dayIndex] ?? [],
      notes: day.focus || 'General Fitness',
    })),
  })
}

export function WorkoutScreen() {
  const plan = usePlanStore((state) => state.plan)
  const setPlan = usePlanStore((state) => state.setPlan)
  const clearPlan = usePlanStore((state) => state.clearPlan)
  const authUser = useUserStore((state) => state.authUser)
  const profile = useUserStore((state) => state.profile)
  const [isLoadingWeeklyPlan, setIsLoadingWeeklyPlan] = useState(false)
  const [isWeeklyPlanMissing, setIsWeeklyPlanMissing] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [selectedStartDate, setSelectedStartDate] = useState(getTodayDateString())
  const [error, setError] = useState<string | null>(null)

  const handleLoadWeek = async () => {
    if (!authUser) {
      setError('Sign in to load a weekly workout plan.')
      return
    }

    setIsLoadingWeeklyPlan(true)
    setError(null)

    try {
      const weeklyPlan = await fetchAiWorkoutPlan(authUser.uid, { startDate: selectedStartDate, days: 7 })
      if (weeklyPlan) {
        const generatedPlan = toGeneratedPlan(weeklyPlan, authUser.uid, plan)
        await setPlan(generatedPlan)
        setIsWeeklyPlanMissing(false)
      } else {
        await clearPlan(authUser.uid)
        setIsWeeklyPlanMissing(true)
      }
    } catch (caughtError) {
      const message = caughtError instanceof Error ? caughtError.message : 'Unable to load your workout week.'
      setError(message)
    } finally {
      setIsLoadingWeeklyPlan(false)
    }
  }

  const handleGenerateWeek = async () => {
    if (!authUser || !profile) {
      setError('Sign in and complete onboarding before generating your AI workout week.')
      return
    }

    setIsGenerating(true)
    setError(null)

    try {
      const response = await generateAiWorkoutPlan({
        userId: authUser.uid,
        savedWorkouts:
          plan?.weeklyPlan.flatMap((day) =>
            day.workout.map((workout) => ({
              id: workout.id,
              name: workout.name,
              intensity: workout.intensity,
              targetMuscles: workout.targetMuscles,
              prescription: workout.prescription,
            })),
          ) ?? [],
        goals: profile.goals,
        preferences: {
          ...profile.preferences,
          equipment: profile.equipment,
          scheduleDays: profile.scheduleDays,
        },
        startDate: selectedStartDate,
        days: 7,
      })

      const generatedPlan = toGeneratedPlan(response.plan, authUser.uid, plan)
      await setPlan(generatedPlan)
      setIsWeeklyPlanMissing(false)
    } catch (caughtError) {
      const message = caughtError instanceof Error ? caughtError.message : 'Unable to generate your workout week.'
      setError(message)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="stack">
      <section className="panel">
        <div className="button-row">
          <input
            type="date"
            value={selectedStartDate}
            onChange={(event) => setSelectedStartDate(event.target.value)}
            disabled={isLoadingWeeklyPlan || isGenerating}
          />
          <button
            className="btn"
            type="button"
            onClick={handleLoadWeek}
            disabled={isLoadingWeeklyPlan || isGenerating}
          >
            {isLoadingWeeklyPlan ? 'Loading...' : 'Load Week'}
          </button>
          <button
            className="btn btn-primary"
            type="button"
            onClick={handleGenerateWeek}
            disabled={isGenerating || isLoadingWeeklyPlan}
          >
            {isGenerating ? 'Generating...' : 'Generate New Week'}
          </button>
        </div>
        {error ? <p className="error-message">{error}</p> : null}
      </section>
      {isLoadingWeeklyPlan ? <section className="panel"><p>Loading your weekly plan...</p></section> : null}
      {!isLoadingWeeklyPlan && !plan && isWeeklyPlanMissing ? (
        <section className="panel">
          <p>No weekly plan found yet.</p>
        </section>
      ) : null}
      {(plan?.weeklyPlan ?? []).map((day) => (
        <section className="panel workout-day-panel" key={day.day}>
          <h2>{formatDayHeader(day.day, day.dayType)}</h2>
          <p className="meta">Focus: {formatFocus(day.notes)}</p>
          <div className="cards-grid">
            {day.workout.map((workout, index) => (
              <WorkoutCard key={`${day.day}-${workout.id}-${index}`} workout={workout} dayType={day.dayType} />
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
