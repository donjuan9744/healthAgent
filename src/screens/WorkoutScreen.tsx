import { WorkoutCard } from '../components/workouts/WorkoutCard'
import { usePlanStore } from '../state/planStore'

export function WorkoutScreen() {
  const plan = usePlanStore((state) => state.plan)

  if (!plan) {
    return <section className="panel"><p>No workout plan yet. Complete onboarding first.</p></section>
  }

  return (
    <div className="stack">
      {plan.weeklyPlan.map((day) => (
        <section className="panel" key={day.day}>
          <h2>{day.day}</h2>
          <p>{day.notes}</p>
          <p className="meta">Prescription format: sets x reps or sets x sec, based on each exercise.</p>
          <div className="cards-grid">
            {day.workout.map((workout, index) => (
              <WorkoutCard key={`${day.day}-${workout.id}-${index}`} workout={workout} />
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
