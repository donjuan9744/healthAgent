import { MealCard } from '../components/nutrition/MealCard'
import { usePlanStore } from '../state/planStore'

export function NutritionScreen() {
  const plan = usePlanStore((state) => state.plan)

  if (!plan) {
    return <section className="panel"><p>No nutrition plan yet. Complete onboarding first.</p></section>
  }

  return (
    <div className="stack">
      {plan.weeklyPlan.map((day) => (
        <section className="panel" key={day.day}>
          <h2>{day.day}</h2>
          <div className="cards-grid">
            {day.meals.map((meal) => (
              <MealCard key={`${day.day}-${meal.id}`} meal={meal} />
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
