import type { NutritionMeal } from '../../types/models'

interface Props {
  meal: NutritionMeal
}

export function MealCard({ meal }: Props) {
  return (
    <article className="card-item">
      <img src={meal.imageUrl} alt={meal.name} loading="lazy" />
      <div>
        <h3>{meal.name}</h3>
        <p>{meal.description}</p>
        <p className="meta">
          {meal.calories} kcal · P {meal.proteinG}g · C {meal.carbsG}g · F {meal.fatsG}g
        </p>
      </div>
    </article>
  )
}
