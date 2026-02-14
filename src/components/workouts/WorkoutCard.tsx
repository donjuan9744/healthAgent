import type { WorkoutExercise } from '../../types/models'

interface Props {
  workout: WorkoutExercise
}

const FALLBACK_PRESCRIPTION = '—'

function getPrescriptionLabel(workout: WorkoutExercise): string {
  const prescription = workout.prescription
  if (!prescription || typeof prescription !== 'object') {
    return FALLBACK_PRESCRIPTION
  }

  if (prescription.type === 'reps') {
    if (typeof prescription.sets === 'number' && typeof prescription.reps === 'number') {
      return `${prescription.sets} x ${prescription.reps} reps`
    }
    return FALLBACK_PRESCRIPTION
  }

  if (prescription.type === 'time') {
    if (typeof prescription.sets === 'number' && typeof prescription.seconds === 'number') {
      return `${prescription.sets} x ${prescription.seconds} sec`
    }
    return FALLBACK_PRESCRIPTION
  }

  return FALLBACK_PRESCRIPTION
}

export function WorkoutCard({ workout }: Props) {
  const prescriptionLabel = getPrescriptionLabel(workout)

  return (
    <article className="card-item">
      <img src={workout.imageUrl} alt={workout.name} loading="lazy" />
      <div>
        <h3>{workout.name}</h3>
        <p>{workout.description}</p>
        <p className="meta">{workout.targetMuscles.join(' • ')} · {prescriptionLabel} · {workout.intensity}</p>
      </div>
    </article>
  )
}
