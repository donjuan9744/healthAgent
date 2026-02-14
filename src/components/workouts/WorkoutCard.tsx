import type { WorkoutExercise } from '../../types/models'

interface Props {
  workout: WorkoutExercise
  dayType?: string
}

const FALLBACK_PRESCRIPTION = '—'

function getPrescriptionLabel(workout: WorkoutExercise): string {
  const prescription = workout.prescription
  if (!prescription || typeof prescription !== 'object') {
    return FALLBACK_PRESCRIPTION
  }

  if (prescription.type === 'reps') {
    if (typeof prescription.sets === 'number' && typeof prescription.reps === 'number') {
      return `${prescription.sets} × ${prescription.reps} reps`
    }
    return FALLBACK_PRESCRIPTION
  }

  if (prescription.type === 'time') {
    if (typeof prescription.sets === 'number' && typeof prescription.seconds === 'number') {
      return `${prescription.sets} × ${prescription.seconds} sec`
    }
    return FALLBACK_PRESCRIPTION
  }

  return FALLBACK_PRESCRIPTION
}

function isRestWorkout(workout: WorkoutExercise, dayType?: string): boolean {
  const normalizedDayType = dayType?.trim().toLowerCase()
  if (normalizedDayType === 'rest') {
    return true
  }

  return workout.name.toLowerCase().includes('rest')
}

export function WorkoutCard({ workout, dayType }: Props) {
  if (isRestWorkout(workout, dayType)) {
    return (
      <article className="card-item">
        <h3 className="workout-line">Rest Day</h3>
      </article>
    )
  }

  const prescriptionLabel = getPrescriptionLabel(workout)

  return (
    <article className="card-item">
      <h3 className="workout-line">{workout.name} — {prescriptionLabel}</h3>
    </article>
  )
}
